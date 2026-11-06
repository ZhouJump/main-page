export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const nameZh = String(body.nameZh ?? '').trim()
  const nameEn = String(body.nameEn ?? '').trim() || nameZh
  const slug = sanitizeSlug(String(body.slug ?? '')) || sanitizeSlug(nameZh)

  if (!nameZh || !slug) {
    throw createError({ statusCode: 400, statusMessage: '标签名称与 slug 不能为空' })
  }

  const duplicate = await prisma.tag.findUnique({ where: { slug } })

  if (duplicate) {
    throw createError({ statusCode: 409, statusMessage: '标签 slug 已存在' })
  }

  const tag = await prisma.tag.create({
    data: { slug, nameZh, nameEn }
  })

  return { id: tag.id }
})
