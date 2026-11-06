export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = parseLang(query.lang)
  const keyword = (typeof query.keyword === 'string' ? query.keyword : '').trim()

  if (!keyword) {
    return { lang, keyword, total: 0, posts: [] }
  }

  const posts = await prisma.post.findMany({
    where: {
      lang,
      status: 'published',
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { excerpt: { contains: keyword, mode: 'insensitive' } },
        { contentMd: { contains: keyword, mode: 'insensitive' } }
      ]
    },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    include: postInclude
  })

  return {
    lang,
    keyword,
    total: posts.length,
    posts: posts.map(serializePost)
  }
})
