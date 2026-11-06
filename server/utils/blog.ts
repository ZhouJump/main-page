import type { Prisma } from '@prisma/client'

export const PAGE_SIZE = 8
export type BlogLang = 'zh' | 'en'

export function parseLang(value: unknown): BlogLang {
  return value === 'en' ? 'en' : 'zh'
}

export function parsePage(value: unknown): number {
  const page = Number.parseInt(String(value ?? '1'), 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

export function langPrefix(lang: BlogLang): string {
  return lang === 'en' ? '/en/blog' : '/blog'
}

export function categoryName(lang: BlogLang, category: { nameZh: string; nameEn: string }): string {
  return lang === 'en' ? category.nameEn : category.nameZh
}

export function tagName(lang: BlogLang, tag: { nameZh: string; nameEn: string }): string {
  return lang === 'en' ? tag.nameEn : tag.nameZh
}

export const postInclude = {
  category: true,
  tags: { include: { tag: true } }
} satisfies Prisma.PostInclude

export type PostWithTaxonomy = Prisma.PostGetPayload<{ include: typeof postInclude }>

export function serializePost(post: PostWithTaxonomy) {
  return {
    id: post.id,
    slug: post.slug,
    lang: post.lang,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt.toISOString(),
    category: post.category,
    tags: post.tags.map((item) => ({
      id: item.tag.id,
      slug: item.tag.slug,
      nameZh: item.tag.nameZh,
      nameEn: item.tag.nameEn
    }))
  }
}

export async function listPosts(options: {
  lang: BlogLang
  page?: number
  categorySlug?: string
  tagSlug?: string
}) {
  const page = options.page ?? 1
  const where: Prisma.PostWhereInput = {
    lang: options.lang,
    status: 'published'
  }

  if (options.categorySlug) {
    where.category = { slug: options.categorySlug }
  }

  if (options.tagSlug) {
    where.tags = {
      some: {
        tag: { slug: options.tagSlug }
      }
    }
  }

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      include: postInclude,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  ])

  return {
    page,
    pageSize: PAGE_SIZE,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    posts: posts.map(serializePost)
  }
}

export async function getPost(lang: BlogLang, slug: string) {
  const post = await prisma.post.findUnique({
    where: { lang_slug: { lang, slug } },
    include: postInclude
  })

  if (!post || post.status !== 'published') {
    return null
  }

  return post
}
