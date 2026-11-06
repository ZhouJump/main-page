import type { H3Event } from 'h3'
import type { BlogLang } from './blog'

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export async function buildSitemap(event: H3Event, lang: BlogLang) {
  const config = useRuntimeConfig(event)
  const siteBase = String(config.public.siteWwwUrl).replace(/\/$/, '')
  const prefix = langPrefix(lang)

  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: { lang, status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, publishedAt: true }
    }),
    prisma.category.findMany({ orderBy: { id: 'asc' }, select: { slug: true } }),
    prisma.tag.findMany({ orderBy: { id: 'asc' }, select: { slug: true } })
  ])

  const entries: { path: string; lastmod?: string }[] = [
    { path: `${prefix}/` },
    { path: `${prefix}/archives/` },
    { path: `${prefix}/categories/` },
    { path: `${prefix}/tags/` },
    { path: `${prefix}/search/` },
    { path: `${prefix}/links/` },
    { path: `${prefix}/post/` },
    { path: `${prefix}/page/` },
    ...posts.map((post) => ({
      path: `${prefix}/p/${post.slug}/`,
      lastmod: post.publishedAt.toISOString()
    })),
    ...categories.map((category) => ({ path: `${prefix}/categories/${encodeURIComponent(category.slug)}/` })),
    ...tags.map((tag) => ({ path: `${prefix}/tags/${encodeURIComponent(tag.slug)}/` }))
  ]

  const urls = entries
    .map((entry) => {
      const loc = `${siteBase}${entry.path}`
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
}
