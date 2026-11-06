export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, unknown>>(event)

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const existing = await prisma.tag.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '标签不存在' })
  }

  const nameZh = String(body.nameZh ?? '').trim()
  const nameEn = String(body.nameEn ?? '').trim() || nameZh
  const slug = sanitizeSlug(String(body.slug ?? '')) || sanitizeSlug(nameZh) || existing.slug

  if (!nameZh) {
    throw createError({ statusCode: 400, statusMessage: '标签名称不能为空' })
  }

  if (slug !== existing.slug) {
    const duplicate = await prisma.tag.findUnique({ where: { slug } })

    if (duplicate) {
      throw createError({ statusCode: 409, statusMessage: '标签 slug 已存在' })
    }
  }

  await prisma.tag.update({
    where: { id },
    data: { nameZh, nameEn, slug }
  })

  return { ok: true }
})
