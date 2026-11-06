export const BLOG_BASE = '/blog'
export const EN_BLOG_BASE = '/en/blog'

// journal-only subtrees, relative to the journal root
const BLOG_SUBPATHS = ['/p', '/categories', '/tags', '/page', '/post', '/archives', '/links', '/search']

const WWW_ONLY_PATHS = ['/project', '/about', '/admin']

/** 路径是否命中某个路径段（命中自身、带尾斜杠或子路径） */
export function matchesPath(pathname: string, base: string): boolean {
  if (!pathname) {
    return false
  }

  return pathname === base || pathname === `${base}/` || pathname.startsWith(`${base}/`)
}

/** 是否已经是 /blog 前缀路径 */
export function isBlogPath(pathname: string): boolean {
  return matchesPath(pathname, BLOG_BASE)
}

/** 旧英文博客 /blog/en/* -> /en/blog/*；返回 null 表示不命中 */
export function legacyEnBlogPath(pathname: string): string | null {
  if (!matchesPath(pathname, `${BLOG_BASE}/en`)) {
    return null
  }

  return `${EN_BLOG_BASE}${pathname.slice(`${BLOG_BASE}/en`.length)}`
}

/** www 上旧的博客路径 -> 博客前缀；返回 null 表示不跳转 */
export function wwwToBlogPath(pathname: string): string | null {
  const legacyEn = legacyEnBlogPath(pathname)
  if (legacyEn) {
    return legacyEn
  }

  if (isBlogPath(pathname) || matchesPath(pathname, EN_BLOG_BASE)) {
    return null
  }

  // 旧 Hugo 英文博客的内容路径（/en/p、/en/categories …）并入 /en/blog，
  // 而 /en 本身（以及 /en/about、/en/project …）属于英文版主站
  if (matchesPath(pathname, '/en')) {
    const rest = pathname.slice('/en'.length)

    if (BLOG_SUBPATHS.some((sub) => matchesPath(rest, sub))) {
      return `${EN_BLOG_BASE}${rest}`
    }

    return null
  }

  if (BLOG_SUBPATHS.some((sub) => matchesPath(pathname, sub))) {
    return `${BLOG_BASE}${pathname}`
  }

  return null
}

/** blog 子域路径 -> www 上对应的路径（admin 除外） */
export function blogToWwwPath(pathname: string): string {
  if (WWW_ONLY_PATHS.some((prefix) => matchesPath(pathname, prefix))) {
    return pathname
  }

  const legacyEn = legacyEnBlogPath(pathname)
  if (legacyEn) {
    return legacyEn
  }

  if (isBlogPath(pathname) || matchesPath(pathname, EN_BLOG_BASE)) {
    return pathname
  }

  // blog 子域上的 /en 是旧英文博客的根
  if (matchesPath(pathname, '/en')) {
    return `${EN_BLOG_BASE}${pathname.slice('/en'.length)}`
  }

  return `${BLOG_BASE}${pathname === '/' ? '/' : pathname}`
}

/** 旧站语言别名：/zh-cn/ 归一到博客中文首页 */
export function legacyLanguageAlias(pathname: string): string | null {
  if (pathname === '/zh-cn' || pathname === '/zh-cn/') {
    return `${BLOG_BASE}/`
  }

  if (pathname.startsWith('/zh-cn/')) {
    return `${BLOG_BASE}${pathname.slice('/zh-cn'.length)}`
  }

  return null
}
