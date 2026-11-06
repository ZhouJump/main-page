export type BilingualPostLanguage = {
  title: string
  excerpt: string
  contentMd: string
}

export type BilingualPostInput = {
  slug: string
  categoryId: number
  tagIds: number[]
  status: 'draft' | 'published'
  publishedAt: Date
  zh: BilingualPostLanguage
  en: BilingualPostLanguage
}

function parseLanguage(value: unknown): BilingualPostLanguage {
  const record = (value ?? {}) as Record<string, unknown>

  return {
    title: String(record.title ?? '').trim(),
    excerpt: String(record.excerpt ?? '').trim(),
    contentMd: String(record.contentMd ?? '')
  }
}

export async function parseBilingualInput(body: Record<string, unknown>): Promise<BilingualPostInput> {
  const zh = parseLanguage(body.zh)
  const en = parseLanguage(body.en)

  if (!zh.title || !en.title) {
    throw createError({ statusCode: 400, statusMessage: '中文和英文标题都需要填写' })
  }

  const slug = sanitizeSlug(String(body.slug ?? '')) || sanitizeSlug(zh.title)

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug 不能为空' })
  }

  const categoryId = Number(body.categoryId)

  if (!Number.isFinite(categoryId) || !(await prisma.category.findUnique({ where: { id: categoryId } }))) {
    throw createError({ statusCode: 400, statusMessage: '分类不存在' })
  }

  const publishedAt = new Date(String(body.publishedAt ?? ''))

  return {
    slug,
    categoryId,
    tagIds: Array.isArray(body.tagIds) ? body.tagIds.map(Number).filter(Number.isFinite) : [],
    status: body.status === 'published' ? 'published' : 'draft',
    publishedAt: Number.isFinite(publishedAt.getTime()) ? publishedAt : new Date(),
    zh,
    en
  }
}

export function bilingualData(input: BilingualPostInput, lang: 'zh' | 'en') {
  return {
    slug: input.slug,
    title: input[lang].title,
    excerpt: input[lang].excerpt,
    contentMd: input[lang].contentMd,
    categoryId: input.categoryId,
    status: input.status,
    publishedAt: input.publishedAt,
    tags: {
      deleteMany: {},
      create: input.tagIds.map((tagId) => ({ tagId }))
    }
  }
}
