import type { H3Event } from 'h3'
import type { BlogLang } from './blog'

export async function buildMarkdownIndex(event: H3Event, lang: BlogLang) {
  const config = useRuntimeConfig(event)
  const siteBase = String(config.public.siteWwwUrl).replace(/\/$/, '')
  const prefix = langPrefix(lang)

  const posts = await prisma.post.findMany({
    where: { lang, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, publishedAt: true, category: true }
  })

  const heading = lang === 'en' ? '# zhoujump · journal' : '# zhoujump · 手记'
  const intro = lang === 'en' ? 'Notes on frontend engineering and building things.' : '前端工程与产品实现的手记。'

  const items = posts
    .map((post) => {
      const url = `${siteBase}${prefix}/p/${post.slug}/`
      const date = post.publishedAt.toISOString().slice(0, 10)
      const category = lang === 'en' ? post.category.nameEn : post.category.nameZh

      return `- [${post.title}](${url}) — ${date} · ${category}${post.excerpt ? `\n  ${post.excerpt}` : ''}`
    })
    .join('\n')

  return `${heading}\n\n${intro}\n\n${items}\n`
}
