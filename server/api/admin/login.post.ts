export default defineEventHandler(async (event) => {
  const ip = getClientIp(event)
  const limitKey = `login:${ip}`

  if (isRateLimited(limitKey, 5, 15 * 60 * 1000)) {
    throw createError({ statusCode: 429, statusMessage: '尝试次数过多，请稍后再试' })
  }

  const body = await readBody<{ username?: string; password?: string }>(event)
  const username = (body.username ?? '').trim()
  const password = body.password ?? ''

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: '请输入账号和密码' })
  }

  const user = await authenticateAdmin(username, password)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '账号或密码错误' })
  }

  await setUserSession(event, { user })
  resetRateLimit(limitKey)

  return { ok: true, user }
})
