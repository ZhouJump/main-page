import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parsePage(query.page)
  const take = 20
  const where: Prisma.PostWhereInput = {}

  if (query.status === 'draft' || query.status === 'published') {
    where.status = query.status
  }

  if (typeof query.category === 'string' && query.category) {
    where.category = { slug: query.category }
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { category: true, tags: { include: { tag: true } } }
  })

  const groups = new Map<string, typeof posts>()

  for (const post of posts) {
    const group = groups.get(post.slug)

    if (group) {
      group.push(post)
    } else {
      groups.set(post.slug, [post])
    }
  }

  const keyword = typeof query.keyword === 'string' ? query.keyword.trim().toLowerCase() : ''
  const items = [...groups.values()].filter((group) => {
    if (!keyword) {
      return true
    }

    return group.some((post) => post.slug.toLowerCase().includes(keyword) || post.title.toLowerCase().includes(keyword))
  })

  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / take))
  const slice = items.slice((page - 1) * take, page * take)

  return {
    total,
    page,
    pageCount,
    posts: slice.map((group) => {
      const zh = group.find((post) => post.lang === 'zh')
      const en = group.find((post) => post.lang === 'en')
      const primary = (zh ?? en ?? group[0])!
      const updatedAt = group.reduce((latest, post) => (post.updatedAt > latest ? post.updatedAt : latest), group[0]!.updatedAt)

      return {
        id: primary.id,
        ids: group.map((post) => post.id),
        slug: primary.slug,
        title: primary.title,
        status: primary.status,
        publishedAt: primary.publishedAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        translations: {
          zh: zh?.id ?? null,
          en: en?.id ?? null
        },
        category: {
          id: primary.category.id,
          slug: primary.category.slug,
          nameZh: primary.category.nameZh,
          nameEn: primary.category.nameEn,
          titleColor: primary.category.titleColor,
          imagePath: primary.category.imagePath
        },
        tags: primary.tags.map((item) => item.tag)
      }
    })
  }
})
