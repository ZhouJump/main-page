export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, unknown>>(event)

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const existing = await prisma.post.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const lang = body.lang === 'en' ? 'en' : 'zh'
  const title = String(body.title ?? '').trim()
  const nextSlug = sanitizeSlug(String(body.slug ?? '')) || sanitizeSlug(title)
  const status = body.status === 'draft' ? 'draft' : 'published'
  const categoryId = Number(body.categoryId)
  const contentMd = String(body.contentMd ?? '')
  const excerpt = String(body.excerpt ?? '').trim()
  const publishedAt = new Date(String(body.publishedAt ?? ''))
  const tagIds = Array.isArray(body.tagIds) ? body.tagIds.map(Number).filter(Number.isFinite) : []

  if (!title || !nextSlug) {
    throw createError({ statusCode: 400, statusMessage: '标题和 slug 不能为空' })
  }

  if (existing.status === 'published' && nextSlug !== existing.slug) {
    throw createError({ statusCode: 409, statusMessage: '文章发布后 slug 已锁定' })
  }

  if (!Number.isFinite(categoryId) || !(await prisma.category.findUnique({ where: { id: categoryId } }))) {
    throw createError({ statusCode: 400, statusMessage: '分类不存在' })
  }

  if (nextSlug !== existing.slug || lang !== existing.lang) {
    const duplicate = await prisma.post.findUnique({ where: { lang_slug: { lang, slug: nextSlug } } })

    if (duplicate) {
      throw createError({ statusCode: 409, statusMessage: '相同语言下 slug 已存在' })
    }
  }

  await prisma.post.update({
    where: { id },
    data: {
      lang,
      slug: existing.status === 'published' ? existing.slug : nextSlug,
      title,
      excerpt,
      contentMd,
      categoryId,
      status,
      publishedAt: Number.isFinite(publishedAt.getTime()) ? publishedAt : existing.publishedAt,
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({ tagId }))
      }
    }
  })

  return { ok: true }
})
