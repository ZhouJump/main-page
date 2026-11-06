export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return buildMarkdownIndex(event, 'zh')
})
