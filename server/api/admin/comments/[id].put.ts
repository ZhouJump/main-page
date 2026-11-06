export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, unknown>>(event)

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const status = body.status === 'hidden' ? 'hidden' : 'visible'
  const existing = await prisma.comment.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '评论不存在' })
  }

  await prisma.comment.update({ where: { id }, data: { status } })

  return { ok: true, status }
})
