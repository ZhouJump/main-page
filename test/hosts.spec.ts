import { describe, expect, it } from 'vitest'
import { isLocalHost, normalizeHost, resolveSite } from '../shared/utils/hosts'

describe('normalizeHost', () => {
  it('去掉端口并转小写', () => {
    expect(normalizeHost('WWW.ZHOUJUMP.COM:3000')).toBe('www.zhoujump.com')
  })

  it('处理空值', () => {
    expect(normalizeHost(undefined)).toBe('')
    expect(normalizeHost(null)).toBe('')
  })
})

describe('resolveSite', () => {
  const www = 'www.zhoujump.com'
  const blog = 'blog.zhoujump.com'

  it('识别两个站点', () => {
    expect(resolveSite(www, www, blog)).toBe('www')
    expect(resolveSite(blog, www, blog)).toBe('blog')
  })

  it('兼容子域名与本地开发', () => {
    expect(resolveSite('blog.localhost', www, blog)).toBe('blog')
    expect(resolveSite('localhost', www, blog)).toBe('www')
    expect(resolveSite('127.0.0.1', www, blog)).toBe('www')
  })

  it('未知域名不归类', () => {
    expect(resolveSite('example.com', www, blog)).toBe('unknown')
  })
})

describe('isLocalHost', () => {
  it('识别本地域名', () => {
    expect(isLocalHost('localhost')).toBe(true)
    expect(isLocalHost('blog.localhost')).toBe(true)
    expect(isLocalHost('www.zhoujump.com')).toBe(false)
  })
})
