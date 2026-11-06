import { describe, expect, it } from 'vitest'
import { blogToWwwPath, isBlogPath, legacyLanguageAlias, matchesPath, wwwToBlogPath } from '../shared/utils/redirects'

describe('matchesPath', () => {
  it('匹配自身、尾斜杠与子路径', () => {
    expect(matchesPath('/categories', '/categories')).toBe(true)
    expect(matchesPath('/categories/', '/categories')).toBe(true)
    expect(matchesPath('/categories/vue/', '/categories')).toBe(true)
  })

  it('不误伤相似前缀', () => {
    expect(matchesPath('/categoriesvue', '/categories')).toBe(false)
    expect(matchesPath('/p', '/page')).toBe(false)
  })
})

describe('isBlogPath', () => {
  it('识别 /blog 前缀', () => {
    expect(isBlogPath('/blog')).toBe(true)
    expect(isBlogPath('/blog/')).toBe(true)
    expect(isBlogPath('/blog/p/foo/')).toBe(true)
  })

  it('不误伤相似路径', () => {
    expect(isBlogPath('/blogroll')).toBe(false)
    expect(isBlogPath('/project')).toBe(false)
  })
})

describe('wwwToBlogPath', () => {
  it('旧博客路径 301 到 /blog 前缀', () => {
    expect(wwwToBlogPath('/p/foo/')).toBe('/blog/p/foo/')
    expect(wwwToBlogPath('/categories/vue/')).toBe('/blog/categories/vue/')
    expect(wwwToBlogPath('/search/')).toBe('/blog/search/')
  })

  it('旧 Hugo 英文内容路径 301 到 /en/blog', () => {
    expect(wwwToBlogPath('/en/p/foo/')).toBe('/en/blog/p/foo/')
    expect(wwwToBlogPath('/en/categories/css/')).toBe('/en/blog/categories/css/')
    expect(wwwToBlogPath('/en/tags/')).toBe('/en/blog/tags/')
  })

  it('旧 /blog/en 路径 301 到 /en/blog', () => {
    expect(wwwToBlogPath('/blog/en')).toBe('/en/blog')
    expect(wwwToBlogPath('/blog/en/')).toBe('/en/blog/')
    expect(wwwToBlogPath('/blog/en/p/foo/')).toBe('/en/blog/p/foo/')
    expect(wwwToBlogPath('/blog/en/categories/css/')).toBe('/en/blog/categories/css/')
  })

  it('已在新路径上不再跳转', () => {
    expect(wwwToBlogPath('/blog')).toBeNull()
    expect(wwwToBlogPath('/blog/')).toBeNull()
    expect(wwwToBlogPath('/blog/p/foo/')).toBeNull()
    expect(wwwToBlogPath('/en/blog')).toBeNull()
    expect(wwwToBlogPath('/en/blog/')).toBeNull()
    expect(wwwToBlogPath('/en/blog/p/foo/')).toBeNull()
    expect(wwwToBlogPath('/blogroll')).toBeNull()
    expect(wwwToBlogPath('/index.xml')).toBeNull()
  })

  it('主站路径不跳转', () => {
    expect(wwwToBlogPath('/')).toBeNull()
    expect(wwwToBlogPath('/project')).toBeNull()
    expect(wwwToBlogPath('/about')).toBeNull()
    expect(wwwToBlogPath('/admin')).toBeNull()
    // /en 是英文版主站，不再整棵跳到博客
    expect(wwwToBlogPath('/en')).toBeNull()
    expect(wwwToBlogPath('/en/')).toBeNull()
    expect(wwwToBlogPath('/en/about')).toBeNull()
    expect(wwwToBlogPath('/en/project')).toBeNull()
  })
})

describe('blogToWwwPath', () => {
  it('blog 子域整体并入 /blog', () => {
    expect(blogToWwwPath('/')).toBe('/blog/')
    expect(blogToWwwPath('/p/foo/')).toBe('/blog/p/foo/')
    expect(blogToWwwPath('/categories/')).toBe('/blog/categories/')
  })

  it('blog 子域的 /en 与 /blog/en 并入 /en/blog', () => {
    expect(blogToWwwPath('/en')).toBe('/en/blog')
    expect(blogToWwwPath('/en/')).toBe('/en/blog/')
    expect(blogToWwwPath('/en/p/foo/')).toBe('/en/blog/p/foo/')
    expect(blogToWwwPath('/blog/en/p/foo/')).toBe('/en/blog/p/foo/')
    expect(blogToWwwPath('/en/blog/p/foo/')).toBe('/en/blog/p/foo/')
  })

  it('已是 /blog 前缀时保持原路径', () => {
    expect(blogToWwwPath('/blog')).toBe('/blog')
    expect(blogToWwwPath('/blog/p/foo/')).toBe('/blog/p/foo/')
  })

  it('主站路径保持原路径', () => {
    expect(blogToWwwPath('/project')).toBe('/project')
    expect(blogToWwwPath('/project/noteflow')).toBe('/project/noteflow')
    expect(blogToWwwPath('/about')).toBe('/about')
    expect(blogToWwwPath('/admin')).toBe('/admin')
    expect(blogToWwwPath('/admin/posts')).toBe('/admin/posts')
  })
})

describe('legacyLanguageAlias', () => {
  it('把 /zh-cn 归一到博客首页', () => {
    expect(legacyLanguageAlias('/zh-cn')).toBe('/blog/')
    expect(legacyLanguageAlias('/zh-cn/')).toBe('/blog/')
  })

  it('把 /zh-cn 子路径同步迁到 /blog 前缀', () => {
    expect(legacyLanguageAlias('/zh-cn/sitemap.xml')).toBe('/blog/sitemap.xml')
    expect(legacyLanguageAlias('/en/')).toBeNull()
  })
})
