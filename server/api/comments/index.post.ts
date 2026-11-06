export default defineEventHandler(async (event) => {
  const body = await readBody<CommentInput & { lang?: string; slug?: string }>(event)
  const lang = parseLang(body.lang)
  const slug = String(body.slug ?? '')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: '缺少文章标识' })
  }

  const ip = getClientIp(event)

  if (isRateLimited(`comment:${ip}`, 3, 10 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: '评论太频繁，请 10 分钟后再试' })
  }

  const post = await prisma.post.findUnique({
    where: { lang_slug: { lang, slug } },
    select: { id: true, status: true }
  })

  if (!post || post.status !== 'published') {
    throw createError({ statusCode: 404, statusMessage: '文章不存在' })
  }

  const errors = validateComment(body)

  if (errors.length) {
    const messages: Record<string, string> = {
      nickname: '昵称长度需在 1-30 个字符之间',
      email: '邮箱格式不正确',
      content: '评论内容需在 2-2000 个字符之间',
      honeypot: '提交被拒绝',
      timing: '提交过快，请稍后再试',
      turnstile: '请完成人机验证'
    }

    throw createError({
      statusCode: 400,
      statusMessage: messages[errors[0] ?? ''] ?? '评论提交失败'
    })
  }

  const passed = await verifyTurnstile(String(body.token), ip)

  if (!passed) {
    throw createError({ statusCode: 400, statusMessage: '人机验证未通过，请重试' })
  }

  const email = normalizeEmail(String(body.email ?? ''))
  const created = await prisma.comment.create({
    data: {
      postId: post.id,
      nickname: String(body.nickname).trim(),
      emailHash: email ? md5(email) : null,
      content: String(body.content).trim(),
      ipHash: hashValue(ip),
      status: 'visible'
    }
  })

  return { ok: true, id: created.id }
})
