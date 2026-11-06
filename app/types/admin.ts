export interface AdminCategory {
  id: number
  slug: string
  nameZh: string
  nameEn: string
  descZh: string
  descEn: string
  imagePath: string | null
  titleColor: string
  postCount: number
}

export interface AdminTag {
  id: number
  slug: string
  nameZh: string
  nameEn: string
  postCount: number
}

export interface AdminPostTranslation {
  id: number
  title: string
  excerpt: string
  contentMd: string
}

export interface AdminPostSummary {
  id: number
  ids: number[]
  slug: string
  title: string
  status: 'draft' | 'published'
  publishedAt: string
  updatedAt: string
  translations: { zh: number | null; en: number | null }
  category: { id: number; slug: string; nameZh: string; nameEn: string; titleColor: string; imagePath: string | null }
  tags: AdminTag[]
}

export interface AdminPostList {
  total: number
  page: number
  pageCount: number
  posts: AdminPostSummary[]
}

export interface AdminPostDetail {
  id: number
  slug: string
  lang: 'zh' | 'en'
  title: string
  excerpt: string
  contentMd: string
  status: 'draft' | 'published'
  publishedAt: string
  categoryId: number
  tagIds: number[]
  published: boolean
  translationId: number | null
  translations: {
    zh: AdminPostTranslation | null
    en: AdminPostTranslation | null
  }
}

export interface AdminComment {
  id: number
  nickname: string
  content: string
  status: 'visible' | 'hidden'
  avatar: string | null
  createdAt: string
  post: { title: string; slug: string; lang: 'zh' | 'en' }
}

export interface AdminCommentList {
  total: number
  page: number
  pageCount: number
  counts: { visible: number; hidden: number }
  comments: AdminComment[]
}

export interface AdminOverview {
  posts: { total: number; published: number; drafts: number }
  comments: number
  categories: number
  tags: number
  recentComments: {
    id: number
    nickname: string
    content: string
    status: string
    createdAt: string
    post: { title: string; slug: string; lang: 'zh' | 'en' }
  }[]
}
