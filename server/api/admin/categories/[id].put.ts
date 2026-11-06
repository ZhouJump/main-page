export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, unknown>>(event)

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '参数错误' })
  }

  const existing = await prisma.category.findUnique({ where: { id } })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '分类不存在' })
  }

  const slug = sanitizeSlug(String(body.slug ?? '')) || existing.slug
  const nameZh = String(body.nameZh ?? '').trim()
  const nameEn = String(body.nameEn ?? '').trim() || nameZh
  const descZh = String(body.descZh ?? '').trim()
  const descEn = String(body.descEn ?? '').trim()
  const imagePath = body.imagePath ? String(body.imagePath) : null
  const titleColor = String(body.titleColor ?? existing.titleColor)

  if (!nameZh) {
    throw createError({ statusCode: 400, statusMessage: '中文名称不能为空' })
  }

  if (!isValidHexColor(titleColor)) {
    throw createError({ statusCode: 400, statusMessage: '标题颜色格式不正确' })
  }

  if (slug !== existing.slug) {
    const duplicate = await prisma.category.findUnique({ where: { slug } })

    if (duplicate) {
      throw createError({ statusCode: 409, statusMessage: '分类 slug 已存在' })
    }
  }

  await prisma.category.update({
    where: { id },
    data: { slug, nameZh, nameEn, descZh, descEn, imagePath, titleColor }
  })

  return { ok: true }
})
