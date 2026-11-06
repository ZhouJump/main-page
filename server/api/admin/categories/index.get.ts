export default defineEventHandler(async () => {
  const categories = await prisma.category.findMany({
    orderBy: { slug: 'asc' },
    include: { _count: { select: { posts: true } } }
  })

  return {
    categories: categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      nameZh: category.nameZh,
      nameEn: category.nameEn,
      descZh: category.descZh,
      descEn: category.descEn,
      imagePath: category.imagePath,
      titleColor: category.titleColor,
      postCount: category._count.posts
    }))
  }
})
