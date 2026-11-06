export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const existing = await prisma.tag.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '标签不存在' })
  }

  await prisma.tag.delete({ where: { id } })

  return { ok: true }
})
