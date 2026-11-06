export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  await prisma.post.delete({ where: { id } })

  return { ok: true }
})
