import fs from 'node:fs/promises'
import path from 'node:path'
import { load } from 'cheerio'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

const BASE = 'https://blog.zhoujump.com'
const OUT_DIR = path.resolve('data/legacy')
const POSTS_FILE = path.join(OUT_DIR, 'posts.json')

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*'
})

turndown.use(gfm)

turndown.addRule('fencedCodeBlock', {
  filter: (node) => node.nodeName === 'PRE' && node.firstChild?.nodeName === 'CODE',
  replacement: (_content, node) => {
    const code = node.firstChild
    const className = code.getAttribute('class') ?? ''
    const lang = className.match(/language-([\w-]+)/)?.[1] ?? ''
    const text = code.textContent.replace(/\n$/, '')
    return `\n\n\`\`\`${lang}\n${text}\n\`\`\`\n\n`
  }
})

function cleanMarkdown(markdown) {
  return markdown
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function fetchText(url, attempt = 1) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'zhoujump-v3-import/1.0' } })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    if (attempt >= 3) {
      throw error
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
    return fetchText(url, attempt + 1)
  }
}

function parsePost(html, { slug, lang }) {
  const $ = load(html)
  const content = $('.article-content').first()

  if (!content.length) {
    throw new Error(`找不到正文: ${lang}/${slug}`)
  }

  content.find('script, style').remove()

  // Hugo Chroma 把代码包在带行号的表格里，先还原成标准 pre > code
  content.find('table.lntable').each((_, element) => {
    const table = $(element)
    const codeNodes = table.find('pre code')
    const withLang = codeNodes.filter((_, node) => /\blanguage-/.test($(node).attr('class') ?? '')).last()
    const chosen = withLang.length ? withLang : codeNodes.last()
    const lang = (chosen.attr('class') ?? '').match(/language-([\w-]+)/)?.[1] ?? ''

    const pre = $('<pre></pre>')
    const code = $('<code></code>').text(chosen.text().replace(/\n$/, ''))

    if (lang) {
      code.attr('class', `language-${lang}`)
    }

    pre.append(code)
    table.replaceWith(pre)
  })

  const categories = $('.article-category a')
    .map((_, element) => ({
      slug: decodeURIComponent(($(element).attr('href') ?? '').split('/categories/')[1]?.replace(/\/$/, '') ?? ''),
      name: $(element).text().trim()
    }))
    .get()
    .filter((item) => item.slug)

  const tags = $('.article-tags a')
    .map((_, element) => ({
      slug: decodeURIComponent(($(element).attr('href') ?? '').split('/tags/')[1]?.replace(/\/$/, '') ?? ''),
      name: $(element).text().trim()
    }))
    .get()
    .filter((item) => item.slug)

  const title = $('meta[property="og:title"]').attr('content')?.trim() ?? slug
  const excerpt = ($('meta[property="og:description"]').attr('content') ?? '').trim()
  const publishedAt = $('meta[property="article:published_time"]').attr('content') ?? ''

  return {
    slug,
    lang,
    title,
    excerpt,
    publishedAt: publishedAt ? new Date(publishedAt).toISOString() : '',
    categories,
    tags,
    contentMd: cleanMarkdown(turndown.turndown(content.html() ?? ''))
  }
}

async function main() {
  const zhSitemap = await fetchText(`${BASE}/zh-cn/sitemap.xml`)
  const enSitemap = await fetchText(`${BASE}/en/sitemap.xml`)

  const collectPostUrls = (sitemap, prefix) =>
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => match[1].trim())
      .filter((url) => url.includes('/p/'))
      .map((url) => ({ url: `${url.replace(/\/$/, '')}/`, slug: url.split('/p/')[1].replace(/\/$/, ''), lang: prefix }))

  const collectCategoryUrls = (sitemap, prefix) =>
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => match[1].trim())
      .filter((url) => url.includes('/categories/'))
      .map((url) => ({
        url: `${url.replace(/\/$/, '')}/`,
        slug: url.split('/categories/')[1].replace(/\/$/, ''),
        lang: prefix
      }))
      .filter((item) => item.slug && item.slug !== 'page')

  const posts = [...collectPostUrls(zhSitemap, 'zh'), ...collectPostUrls(enSitemap, 'en')]
  const categoryUrls = [...collectCategoryUrls(zhSitemap, 'zh'), ...collectCategoryUrls(enSitemap, 'en')]

  const results = []

  for (const [index, post] of posts.entries()) {
    const html = await fetchText(post.url)
    results.push(parsePost(html, post))
    console.log(`[${index + 1}/${posts.length}] ${post.lang}/${post.slug} ${post.url}`)
  }

  const categories = {}
  for (const post of results) {
    for (const category of post.categories) {
      categories[category.slug] ??= { slug: category.slug, nameZh: '', nameEn: '' }
      categories[category.slug][post.lang === 'zh' ? 'nameZh' : 'nameEn'] ||= category.name
    }
  }

  // 分类页包含没有文章的分类（如 groceries），补全名称
  for (const item of categoryUrls) {
    const html = await fetchText(item.url)
    const name = html.match(/<title>Category:\s*([^<]+?)\s*-\s*/)?.[1]?.trim() ?? ''

    categories[item.slug] ??= { slug: item.slug, nameZh: '', nameEn: '' }

    if (name) {
      categories[item.slug][item.lang === 'zh' ? 'nameZh' : 'nameEn'] ||= name
    }
  }

  // 中英文章一一对应，按同一篇文章的标签顺序配对；数量不一致时按标签名匹配
  const pairs = []

  const bySlug = new Map()
  for (const post of results) {
    const entry = bySlug.get(post.slug) ?? { zh: [], en: [] }
    entry[post.lang] = post.tags
    bySlug.set(post.slug, entry)
  }

  for (const pair of bySlug.values()) {
    const { zh, en } = pair

    if (zh.length === en.length) {
      zh.forEach((tag, index) => pairs.push({ zh: tag, en: en[index] }))
      continue
    }

    const matchedEn = new Set()

    zh.forEach((tag) => {
      const enIndex = en.findIndex((candidate, index) => !matchedEn.has(index) && candidate.name.toLowerCase() === tag.name.toLowerCase())

      if (enIndex >= 0) {
        matchedEn.add(enIndex)
        pairs.push({ zh: tag, en: en[enIndex] })
        return
      }

      pairs.push({ zh: tag })
    })

    en.forEach((tag, index) => {
      if (!matchedEn.has(index)) {
        pairs.push({ en: tag })
      }
    })
  }

  const mergedTags = new Map()

  for (const pair of pairs) {
    const slugZh = pair.zh?.slug ?? `en-${pair.en.slug}`
    const slugEn = pair.en?.slug ?? `zh-${pair.zh.slug}`
    const key = `${slugZh}|${slugEn}`
    const entry = mergedTags.get(key) ?? { slugZh, slugEn, nameZh: '', nameEn: '' }

    entry.nameZh ||= pair.zh?.name ?? pair.en?.name ?? ''
    entry.nameEn ||= pair.en?.name ?? pair.zh?.name ?? ''

    mergedTags.set(key, entry)
  }

  const normalizedTags = [...mergedTags.values()]

  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.writeFile(
    POSTS_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: BASE,
        categories: Object.values(categories),
        tags: normalizedTags,
        posts: results
      },
      null,
      2
    )
  )

  console.log(`\n完成: ${results.length} 篇文章, ${Object.keys(categories).length} 个分类, ${normalizedTags.length} 个标签`)
  console.log(`输出: ${POSTS_FILE}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
