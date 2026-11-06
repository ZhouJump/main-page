export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true, tags: { include: { tag: true } } }
  })

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const translations = await prisma.post.findMany({
    where: { slug: post.slug },
    select: {
      id: true,
      lang: true,
      title: true,
      excerpt: true,
      contentMd: true,
      status: true,
      publishedAt: true
    }
  })

  const zh = translations.find((item) => item.lang === 'zh')
  const en = translations.find((item) => item.lang === 'en')

  return {
    id: post.id,
    slug: post.slug,
    lang: post.lang,
    title: post.title,
    excerpt: post.excerpt,
    contentMd: post.contentMd,
    status: post.status,
    publishedAt: post.publishedAt.toISOString(),
    categoryId: post.categoryId,
    tagIds: post.tags.map((item) => item.tagId),
    published: translations.some((item) => item.status === 'published'),
    translationId: (post.lang === 'zh' ? en?.id : zh?.id) ?? null,
    translations: {
      zh: zh
        ? { id: zh.id, title: zh.title, excerpt: zh.excerpt, contentMd: zh.contentMd }
        : null,
      en: en
        ? { id: en.id, title: en.title, excerpt: en.excerpt, contentMd: en.contentMd }
        : null
    }
  }
})
