export default defineEventHandler((event) => {
  const wwwBase = String(useRuntimeConfig(event).public.siteWwwUrl).replace(/\/$/, '')
  const paths = [
    '/',
    '/project',
    '/project/mangofairvisa',
    '/project/canvas-web',
    '/project/starify',
    '/project/noteflow',
    '/project/zhangshang-puyuan',
    '/about'
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const urls = paths
    .map((path) => `  <url>\n    <loc>${wwwBase}${path}</loc>\n  </url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
})
