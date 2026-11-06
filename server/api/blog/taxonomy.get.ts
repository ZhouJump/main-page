export default defineEventHandler(async (event) => {
  const lang = parseLang(getQuery(event).lang)
  const postWhere = { lang, status: 'published' }

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { posts: { where: postWhere } }
        }
      }
    }),
    prisma.tag.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { posts: { where: { post: postWhere } } }
        }
      }
    })
  ])

  return {
    lang,
    categories: categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: categoryName(lang, category),
      description: lang === 'en' ? category.descEn : category.descZh,
      imagePath: category.imagePath,
      count: category._count.posts
    })),
    tags: tags.map((tag) => ({
      id: tag.id,
      slug: tag.slug,
      name: tagName(lang, tag),
      count: tag._count.posts
    }))
  }
})
