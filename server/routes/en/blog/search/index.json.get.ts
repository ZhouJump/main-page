export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/json; charset=utf-8')
  return buildSearchIndex(event, 'en')
})
