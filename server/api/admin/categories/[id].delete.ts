export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { posts: true } } }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '分类不存在' })
  }

  if (existing._count.posts > 0) {
    throw createError({ statusCode: 409, statusMessage: '该分类下仍有文章，无法删除' })
  }

  await prisma.category.delete({ where: { id } })

  return { ok: true }
})
