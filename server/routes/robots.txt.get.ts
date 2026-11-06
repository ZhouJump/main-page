export default defineEventHandler((event) => {
  const wwwBase = String(useRuntimeConfig(event).public.siteWwwUrl).replace(/\/$/, '')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${wwwBase}/sitemap.xml`,
    `Sitemap: ${wwwBase}/blog/sitemap.xml`,
    `Sitemap: ${wwwBase}/en/blog/sitemap.xml`,
    ''
  ].join('\n')
})
