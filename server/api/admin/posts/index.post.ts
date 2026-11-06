export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const lang = body.lang === 'en' ? 'en' : 'zh'
  const title = String(body.title ?? '').trim()
  const slug = sanitizeSlug(String(body.slug ?? '')) || sanitizeSlug(title)
  const status = body.status === 'draft' ? 'draft' : 'published'
  const categoryId = Number(body.categoryId)
  const contentMd = String(body.contentMd ?? '')
  const excerpt = String(body.excerpt ?? '').trim()
  const publishedAt = new Date(String(body.publishedAt ?? ''))
  const tagIds = Array.isArray(body.tagIds) ? body.tagIds.map(Number).filter(Number.isFinite) : []

  if (!title || !slug) {
    throw createError({ statusCode: 400, statusMessage: '标题和 slug 不能为空' })
  }

  if (!Number.isFinite(categoryId)) {
    throw createError({ statusCode: 400, statusMessage: '请选择分类' })
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } })

  if (!category) {
    throw createError({ statusCode: 400, statusMessage: '分类不存在' })
  }

  const duplicate = await prisma.post.findUnique({ where: { lang_slug: { lang, slug } } })

  if (duplicate) {
    throw createError({ statusCode: 409, statusMessage: '相同语言下 slug 已存在' })
  }

  const post = await prisma.post.create({
    data: {
      lang,
      slug,
      title,
      excerpt,
      contentMd,
      categoryId,
      status,
      publishedAt: Number.isFinite(publishedAt.getTime()) ? publishedAt : new Date(),
      tags: tagIds.length ? { create: tagIds.map((tagId) => ({ tagId })) } : undefined
    }
  })

  return { id: post.id }
})
