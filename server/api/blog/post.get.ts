export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = parseLang(query.lang)
  const slug = typeof query.slug === 'string' ? query.slug : ''

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: '缺少 slug' })
  }

  const post = await getPost(lang, slug)

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const { html, toc } = renderMarkdown(post.contentMd)
  const serialized = serializePost(post)
  const text = plainText(post.contentMd)
  const readingMinutes =
    lang === 'en'
      ? Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200))
      : Math.max(1, Math.round(text.length / 400))

  const [newer, older, related, translation] = await Promise.all([
    prisma.post.findFirst({
      where: { lang, status: 'published', publishedAt: { gt: post.publishedAt } },
      orderBy: { publishedAt: 'asc' },
      select: { slug: true, title: true }
    }),
    prisma.post.findFirst({
      where: { lang, status: 'published', publishedAt: { lt: post.publishedAt } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true }
    }),
    prisma.post.findMany({
      where: {
        lang,
        status: 'published',
        categoryId: post.categoryId,
        id: { not: post.id }
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: postInclude
    }),
    prisma.post.findFirst({
      where: { lang: lang === 'zh' ? 'en' : 'zh', slug: post.slug, status: 'published' },
      select: { slug: true }
    })
  ])

  return {
    ...serialized,
    html,
    toc,
    readingMinutes,
    newer,
    older,
    translationSlug: translation?.slug ?? null,
    related: related.map(serializePost)
  }
})
