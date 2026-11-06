export default defineEventHandler(async () => {
  const tags = await prisma.tag.findMany({
    orderBy: { nameZh: 'asc' },
    include: { _count: { select: { posts: true } } }
  })

  return {
    tags: tags.map((tag) => ({
      id: tag.id,
      slug: tag.slug,
      nameZh: tag.nameZh,
      nameEn: tag.nameEn,
      postCount: tag._count.posts
    }))
  }
})
