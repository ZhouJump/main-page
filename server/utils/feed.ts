import type { H3Event } from 'h3'
import type { BlogLang } from './blog'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function buildRssFeed(event: H3Event, lang: BlogLang) {
  const config = useRuntimeConfig(event)
  const siteBase = String(config.public.siteWwwUrl).replace(/\/$/, '')
  const prefix = langPrefix(lang)
  const siteUrl = `${siteBase}${prefix}/`

  const posts = await prisma.post.findMany({
    where: { lang, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 20
  })

  const items = posts
    .map((post) => {
      const link = `${siteBase}${prefix}/p/${post.slug}/`
      const { html } = renderMarkdown(post.contentMd)

      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${post.publishedAt.toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        `      <content:encoded><![CDATA[${html}]]></content:encoded>`,
        '    </item>'
      ].join('\n')
    })
    .join('\n')

  const title = lang === 'en' ? 'zhoujump · journal' : 'zhoujump · 手记'
  const description = lang === 'en' ? 'Notes on frontend engineering and building things.' : '前端工程与产品实现的手记。'

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(siteUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${lang === 'en' ? 'en' : 'zh-cn'}</language>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${siteBase}${prefix}/index.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>'
  ].join('\n')
}
