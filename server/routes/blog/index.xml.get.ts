export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return buildRssFeed(event, 'zh')
})
