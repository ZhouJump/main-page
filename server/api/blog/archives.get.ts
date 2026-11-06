export default defineEventHandler(async (event) => {
  const lang = parseLang(getQuery(event).lang)
  const posts = await prisma.post.findMany({
    where: { lang, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    select: {
      slug: true,
      title: true,
      publishedAt: true,
      category: { select: { slug: true, nameZh: true, nameEn: true } }
    }
  })

  const years = new Map<number, typeof posts>()

  for (const post of posts) {
    const year = post.publishedAt.getFullYear()
    const bucket = years.get(year) ?? []
    bucket.push(post)
    years.set(year, bucket)
  }

  return {
    lang,
    total: posts.length,
    years: [...years.entries()].map(([year, items]) => ({
      year,
      count: items.length,
      posts: items.map((post) => ({
        slug: post.slug,
        title: post.title,
        publishedAt: post.publishedAt.toISOString(),
        category: post.category
      }))
    }))
  }
})
