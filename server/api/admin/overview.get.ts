export default defineEventHandler(async () => {
  const [total, published, drafts, comments, categories, tags, recentComments] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.post.count({ where: { status: 'draft' } }),
    prisma.comment.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { post: { select: { title: true, slug: true, lang: true } } }
    })
  ])

  return {
    posts: { total, published, drafts },
    comments,
    categories,
    tags,
    recentComments: recentComments.map((comment) => ({
      id: comment.id,
      nickname: comment.nickname,
      content: comment.content,
      status: comment.status,
      createdAt: comment.createdAt.toISOString(),
      post: comment.post
    }))
  }
})
