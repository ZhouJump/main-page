export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = parseLang(query.lang)
  const page = parsePage(query.page)
  const categorySlug = typeof query.category === 'string' ? query.category : undefined
  const tagSlug = typeof query.tag === 'string' ? query.tag : undefined

  return listPosts({ lang, page, categorySlug, tagSlug })
})
