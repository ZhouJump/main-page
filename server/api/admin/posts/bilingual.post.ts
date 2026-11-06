export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const input = await parseBilingualInput(body)

  const duplicate = await prisma.post.findFirst({ where: { slug: input.slug } })

  if (duplicate) {
    throw createError({ statusCode: 409, statusMessage: 'slug 已存在' })
  }

  const result = await prisma.$transaction(async (tx) => {
    const zh = await tx.post.create({
      data: { lang: 'zh', ...bilingualData(input, 'zh'), tags: { create: input.tagIds.map((tagId) => ({ tagId })) } }
    })
    const en = await tx.post.create({
      data: { lang: 'en', ...bilingualData(input, 'en'), tags: { create: input.tagIds.map((tagId) => ({ tagId })) } }
    })

    return { id: zh.id, ids: { zh: zh.id, en: en.id } }
  })

  return result
})
