export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const slug = sanitizeSlug(String(body.slug ?? ''))
  const nameZh = String(body.nameZh ?? '').trim()
  const nameEn = String(body.nameEn ?? '').trim() || nameZh
  const descZh = String(body.descZh ?? '').trim()
  const descEn = String(body.descEn ?? '').trim()
  const imagePath = body.imagePath ? String(body.imagePath) : null
  const titleColor = String(body.titleColor ?? '#EFEFEB')

  if (!slug || !nameZh) {
    throw createError({ statusCode: 400, statusMessage: '分类 slug 与中文名称不能为空' })
  }

  if (!isValidHexColor(titleColor)) {
    throw createError({ statusCode: 400, statusMessage: '标题颜色格式不正确' })
  }

  const duplicate = await prisma.category.findUnique({ where: { slug } })

  if (duplicate) {
    throw createError({ statusCode: 409, statusMessage: '分类 slug 已存在' })
  }

  const category = await prisma.category.create({
    data: { slug, nameZh, nameEn, descZh, descEn, imagePath, titleColor }
  })

  return { id: category.id }
})
