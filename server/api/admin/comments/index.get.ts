import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parsePage(query.page)
  const take = 20
  const where: Prisma.CommentWhereInput = {}

  if (query.status === 'visible' || query.status === 'hidden') {
    where.status = query.status
  }

  if (typeof query.keyword === 'string' && query.keyword.trim()) {
    const keyword = query.keyword.trim()
    where.OR = [
      { nickname: { contains: keyword, mode: 'insensitive' } },
      { content: { contains: keyword, mode: 'insensitive' } }
    ]
  }

  const [total, comments, visibleCount, hiddenCount] = await prisma.$transaction([
    prisma.comment.count({ where }),
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * take,
      take,
      include: { post: { select: { title: true, slug: true, lang: true } } }
    }),
    prisma.comment.count({ where: { status: 'visible' } }),
    prisma.comment.count({ where: { status: 'hidden' } })
  ])

  return {
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / take)),
    counts: { visible: visibleCount, hidden: hiddenCount },
    comments: comments.map((comment) => ({
      id: comment.id,
      nickname: comment.nickname,
      content: comment.content,
      status: comment.status,
      avatar: gravatarUrl(comment.emailHash, 64),
      createdAt: comment.createdAt.toISOString(),
      post: comment.post
    }))
  }
})
