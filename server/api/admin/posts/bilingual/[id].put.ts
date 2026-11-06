export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const existing = await prisma.post.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const body = await readBody<Record<string, unknown>>(event)
  const input = await parseBilingualInput(body)
  const oldSlug = existing.slug
  const rows = await prisma.post.findMany({ where: { slug: oldSlug } })
  const zh = rows.find((row) => row.lang === 'zh')
  const en = rows.find((row) => row.lang === 'en')
  const published = rows.some((row) => row.status === 'published')

  if (published && input.slug !== oldSlug) {
    throw createError({ statusCode: 409, statusMessage: '文章发布后 slug 已锁定' })
  }

  if (input.slug !== oldSlug) {
    const duplicate = await prisma.post.findFirst({ where: { slug: input.slug } })

    if (duplicate) {
      throw createError({ statusCode: 409, statusMessage: 'slug 已存在' })
    }
  }

  const ids = await prisma.$transaction(async (tx) => {
    const result: { zh: number; en: number } = { zh: 0, en: 0 }

    for (const lang of ['zh', 'en'] as const) {
      const row = lang === 'zh' ? zh : en

      if (row) {
        await tx.post.update({ where: { id: row.id }, data: bilingualData(input, lang) })
        result[lang] = row.id
      } else {
        const created = await tx.post.create({
          data: { lang, ...bilingualData(input, lang), tags: { create: input.tagIds.map((tagId) => ({ tagId })) } }
        })
        result[lang] = created.id
      }
    }

    return result
  })

  return { ok: true, ids }
})
