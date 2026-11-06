export interface Tag {
  id: number
  slug: string
  nameZh: string
  nameEn: string
}

export interface Category {
  id: number
  slug: string
  nameZh: string
  nameEn: string
  descZh: string
  descEn: string
  imagePath: string | null
  titleColor: string
}

export interface PostSummary {
  id: number
  slug: string
  lang: 'zh' | 'en'
  title: string
  excerpt: string
  publishedAt: string
  category: Category
  tags: Tag[]
}

export interface PostList {
  page: number
  pageSize: number
  total: number
  pageCount: number
  posts: PostSummary[]
}

export interface TocItem {
  level: number
  id: string
  text: string
}

export interface PostDetail extends PostSummary {
  html: string
  toc: TocItem[]
  readingMinutes: number
  newer: { slug: string; title: string } | null
  older: { slug: string; title: string } | null
  translationSlug: string | null
  related: PostSummary[]
}

export interface TaxonomyItem {
  id: number
  slug: string
  name: string
  count: number
  description?: string
}

export interface CommentItem {
  id: number
  nickname: string
  avatar: string | null
  html: string
  createdAt: string
}

export interface CommentsResponse {
  total: number
  comments: CommentItem[]
}

export interface Taxonomy {
  lang: 'zh' | 'en'
  categories: (TaxonomyItem & { imagePath: string | null })[]
  tags: TaxonomyItem[]
}
