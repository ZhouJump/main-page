import type { H3Event } from 'h3'
import type { BlogLang } from './blog'

export async function buildSearchIndex(event: H3Event, lang: BlogLang) {
  const config = useRuntimeConfig(event)
  const siteBase = String(config.public.siteWwwUrl).replace(/\/$/, '')
  const prefix = langPrefix(lang)

  const posts = await prisma.post.findMany({
    where: { lang, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    select: { slug: true, title: true, contentMd: true, publishedAt: true, category: true }
  })

  return posts.map((post) => ({
    title: post.title,
    date: post.publishedAt.toISOString(),
    permalink: `${siteBase}${prefix}/p/${post.slug}/`,
    image: post.category.imagePath,
    content: plainText(post.contentMd)
  }))
}
