export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = parseLang(query.lang)
  const slug = typeof query.slug === 'string' ? query.slug : ''

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: '缺少 slug' })
  }

  const post = await prisma.post.findUnique({
    where: { lang_slug: { lang, slug } },
    select: { id: true, status: true }
  })

  if (!post || post.status !== 'published') {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const comments = await prisma.comment.findMany({
    where: { postId: post.id, status: 'visible' },
    orderBy: { createdAt: 'asc' },
    select: { id: true, nickname: true, emailHash: true, content: true, createdAt: true }
  })

  return {
    total: comments.length,
    comments: comments.map((comment) => ({
      id: comment.id,
      nickname: comment.nickname,
      avatar: gravatarUrl(comment.emailHash, 96),
      html: renderCommentHtml(comment.content),
      createdAt: comment.createdAt.toISOString()
    }))
  }
})
