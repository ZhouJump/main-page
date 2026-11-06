#!/usr/bin/env node
/**
 * 旧站 URL 迁移验证：遍历旧页面地址与跨站跳转，断言 200 或单跳 301，且最终落点 200。
 *
 * 用法：
 *   node scripts/verify-urls.mjs
 *   node scripts/verify-urls.mjs --report doc/url-verification-report.md
 *
 * 环境变量：
 *   VERIFY_BASE  本地服务地址，默认 http://127.0.0.1:3000
 */
import http from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = new URL(process.env.VERIFY_BASE ?? 'http://127.0.0.1:3000')
const port = base.port || '80'
const wwwHost = `www.localhost:${port}`
const blogHost = `blog.localhost:${port}`

const args = process.argv.slice(2)
const reportIndex = args.indexOf('--report')
const reportPath = reportIndex >= 0 ? args[reportIndex + 1] : null

function request(host, pathname) {
  return new Promise((resolvePromise, rejectPromise) => {
    const req = http.request(
      {
        hostname: base.hostname,
        port: base.port || 80,
        path: pathname,
        method: 'GET',
        headers: { Host: host, 'User-Agent': 'zhoujump-url-verifier' }
      },
      (res) => {
        res.resume()
        res.on('end', () => {
          resolvePromise({
            status: res.statusCode ?? 0,
            location: res.headers.location ?? null
          })
        })
      }
    )

    req.on('error', rejectPromise)
    req.setTimeout(15000, () => req.destroy(new Error(`请求超时: ${host}${pathname}`)))
    req.end()
  })
}

/** 跟随跳转，返回每一跳的状态与地址 */
async function trace(host, pathname, maxHops = 4) {
  const hops = []
  let current = { host, path: pathname }

  for (let i = 0; i <= maxHops; i += 1) {
    const res = await request(current.host, current.path)
    hops.push({ ...current, ...res })

    if (![301, 302, 307, 308].includes(res.status)) {
      break
    }

    if (!res.location) {
      break
    }

    const next = new URL(res.location, `http://${current.host}`)
    current = { host: `${next.hostname}:${next.port || port}`, path: `${next.pathname}${next.search}` }
  }

  return hops
}

function expectFinal200(entry) {
  const last = entry.hops.at(-1)
  return last.status === 200
}

function buildCases(posts) {
  const cases = []
  const add = (site, path, expectation, note) => cases.push({ site, path, expectation, note })

  for (const path of [
    '/',
    '/project',
    '/project/mangofairvisa',
    '/project/canvas-web',
    '/project/starify',
    '/project/noteflow',
    '/project/zhangshang-puyuan',
    '/about',
    '/admin/login'
  ]) {
    add('www', path, '200', '主站页面')
  }

  for (const path of [
    '/blog',
    '/blog/',
    '/blog/p/learn-nuxt-1/',
    '/p/learn-nuxt-1/',
    '/p/learn-nuxt-1',
    '/categories/',
    '/categories/nuxt/',
    '/tags/',
    '/page/2/',
    '/archives/',
    '/links/',
    '/search/',
    '/en/'
  ]) {
    add('www', path, 'redirect-blog', 'www 博客路径跳转')
  }

  const zhPosts = posts.filter((post) => post.lang === 'zh')
  const enPosts = posts.filter((post) => post.lang === 'en')

  add('blog', '/', '200', '博客首页')
  for (let n = 1; n <= 5; n += 1) {
    add('blog', `/page/${n}/`, '200', '中文分页')
    add('blog', `/en/page/${n}/`, '200', '英文分页')
  }

  for (const post of zhPosts) {
    add('blog', `/p/${post.slug}/`, '200', '中文文章')
    add('blog', `/p/${post.slug}`, '200', '中文文章无尾斜杠')
  }

  for (const post of enPosts) {
    add('blog', `/en/p/${post.slug}/`, '200', '英文文章')
    add('blog', `/en/p/${post.slug}`, '200', '英文文章无尾斜杠')
  }

  const categories = JSON.parse(JSON.stringify(legacy.categories))
  for (const category of categories) {
    add('blog', `/categories/${category.slug}/`, '200', '中文分类')
    add('blog', `/en/categories/${category.slug}/`, '200', '英文分类')
  }

  for (const tag of legacy.tags) {
    add('blog', `/tags/${encodeURIComponent(tag.slugZh)}/`, '200', '中文标签')
    add('blog', `/en/tags/${encodeURIComponent(tag.slugEn)}/`, '200', '英文标签')
  }

  for (const path of [
    '/archives/',
    '/categories/',
    '/categories',
    '/tags/',
    '/tags',
    '/search/',
    '/search',
    '/links/',
    '/post/',
    '/page/',
    '/en/',
    '/en/categories/',
    '/en/tags/',
    '/index.xml',
    '/en/index.xml',
    '/index.md',
    '/en/index.md',
    '/search/index.json',
    '/en/search/index.json',
    '/sitemap.xml',
    '/zh-cn/sitemap.xml',
    '/en/sitemap.xml'
  ]) {
    add('blog', path, '200', '博客兼容页与索引')
  }

  add('blog', '/zh-cn/', 'redirect-blog', '语言别名归一到博客首页')
  add('blog', '/project', 'redirect-www', '博客访问主站路径')
  add('blog', '/about', 'redirect-www', '博客访问关于页')

  return cases
}

let legacy

try {
  legacy = JSON.parse(await readFile(resolve(root, 'data/legacy/posts.json'), 'utf8'))
} catch (error) {
  console.error('无法读取 data/legacy/posts.json，请先运行 pnpm db:fetch-legacy')
  console.error(error.message)
  process.exit(1)
}

const cases = buildCases(legacy.posts)
const results = []

for (const entry of cases) {
  const host = entry.site === 'blog' ? blogHost : wwwHost
  const hops = await trace(host, entry.path)
  const first = hops[0]
  const final = hops.at(-1)
  let ok = false
  let reason = ''

  if (entry.expectation === '200') {
    ok = first.status === 200
    reason = ok ? '' : `期望 200，实际 ${first.status}`
  } else if (entry.expectation === 'redirect-blog') {
    ok = first.status === 301 && hops.length >= 2 && hops[1].host.startsWith('blog.') && expectFinal200({ hops })
    reason = ok ? '' : `期望 301 到 blog 且落地 200，实际 ${first.status} → ${first.location ?? '-'}`
  } else {
    ok = first.status === 301 && hops.length >= 2 && hops[1].host.startsWith('www.') && expectFinal200({ hops })
    reason = ok ? '' : `期望 301 到 www 且落地 200，实际 ${first.status} → ${first.location ?? '-'}`
  }

  results.push({ ...entry, ok, reason, hops })
  const line = `${ok ? 'PASS' : 'FAIL'} ${entry.site.toUpperCase()} ${entry.path} [${entry.expectation}]`
  console.log(line + (ok ? '' : ` — ${reason}`))
}

const queryCase = await trace(wwwHost, '/p/learn-nuxt-1/?from=old')
const queryOk =
  queryCase[0].status === 301 &&
  queryCase[0].location?.includes('?from=old') &&
  queryCase[1]?.status === 200
console.log(`${queryOk ? 'PASS' : 'FAIL'} WWW /p/learn-nuxt-1/?from=old [query 保留]`)
results.push({ site: 'www', path: '/p/learn-nuxt-1/?from=old', expectation: 'query', ok: queryOk, reason: queryOk ? '' : 'query 丢失或未落地 200', hops: queryCase })

const failures = results.filter((item) => !item.ok)
const total = results.length
console.log(`\n合计 ${total} 项，通过 ${total - failures.length}，失败 ${failures.length}`)

if (reportPath) {
  const lines = [
    '# 旧 URL 迁移验证报告',
    '',
    `- 生成时间：${new Date().toISOString()}`,
    `- 验证服务：${base.origin}`,
    `- 用例总数：${total}`,
    `- 通过：${total - failures.length}`,
    `- 失败：${failures.length}`,
    '',
    '| 结果 | 站点 | 路径 | 期望 | 首跳状态 | 最终地址 |',
    '| --- | --- | --- | --- | --- | --- |',
    ...results.map((item) => {
      const last = item.hops.at(-1)
      return `| ${item.ok ? 'PASS' : 'FAIL'} | ${item.site} | \`${item.path}\` | ${item.expectation} | ${item.hops[0].status} | \`${last.host}${last.path}\` |`
    }),
    '',
    failures.length ? '## 失败详情\n' + failures.map((item) => `- \`${item.site}${item.path}\`：${item.reason}`).join('\n') : '## 失败详情\n\n无'
  ]
  await writeFile(resolve(root, reportPath), `${lines.join('\n')}\n`, 'utf8')
  console.log(`报告已写入 ${reportPath}`)
}

process.exit(failures.length === 0 ? 0 : 1)
