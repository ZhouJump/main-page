import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const repoDir = process.argv[2]

if (!repoDir) {
  console.error('用法: node --env-file=.env scripts/import-repo.mjs <博客仓库路径>')
  process.exit(1)
}

const contentDir = path.join(repoDir, 'content/post')
const assetDir = path.resolve('public/blog-assets')

if (!fs.existsSync(contentDir)) {
  console.error(`未找到内容目录: ${contentDir}`)
  process.exit(1)
}

const CATEGORY_DEFS = {
  technology: { slug: 'technology', nameZh: '技术分享', nameEn: 'Technology Sharing' },
  css: { slug: 'css', nameZh: 'CSS', nameEn: 'CSS' },
  html: { slug: 'html', nameZh: 'HTML', nameEn: 'HTML' },
  javascript: { slug: 'javascript', nameZh: 'Javascript', nameEn: 'Javascript' },
  vue: { slug: 'vue', nameZh: 'Vue', nameEn: 'Vue' },
  nuxt: { slug: 'nuxt', nameZh: 'Nuxt', nameEn: 'Nuxt' },
  'resume-tool': { slug: 'resume-tool', nameZh: '简历编辑器', nameEn: 'Resume Editor' }
}

const TAG_DEFS = {
  html: { slug: 'html', nameZh: 'HTML', nameEn: 'HTML' },
  css: { slug: 'css', nameZh: 'CSS', nameEn: 'CSS' },
  javascript: { slug: 'javascript', nameZh: 'Javascript', nameEn: 'Javascript' },
  vue: { slug: 'vue', nameZh: 'Vue', nameEn: 'Vue' },
  nuxt: { slug: 'nuxt', nameZh: 'Nuxt', nameEn: 'Nuxt' },
  hugo: { slug: 'hugo', nameZh: 'Hugo', nameEn: 'Hugo' },
  gitlab: { slug: 'gitlab', nameZh: 'GitLab', nameEn: 'GitLab' },
  cloudflare: { slug: 'cloudflare', nameZh: 'Cloudflare', nameEn: 'Cloudflare' },
  unity: { slug: 'unity', nameZh: 'Unity', nameEn: 'Unity' },
  noteflow: { slug: 'noteflow', nameZh: 'NoteFlow', nameEn: 'NoteFlow' },
  博客: { slug: '博客', nameZh: '博客', nameEn: 'Blog' },
  blog: { slug: '博客', nameZh: '博客', nameEn: 'Blog' },
  个人项目: { slug: '个人项目', nameZh: '个人项目', nameEn: 'Personal Project' },
  'personal project': { slug: '个人项目', nameZh: '个人项目', nameEn: 'Personal Project' },
  简历: { slug: '简历', nameZh: '简历', nameEn: 'Resume' },
  resume: { slug: '简历', nameZh: '简历', nameEn: 'Resume' },
  看板娘: { slug: '看板娘', nameZh: '看板娘', nameEn: 'Poster Girl' },
  'poster girl': { slug: '看板娘', nameZh: '看板娘', nameEn: 'Poster Girl' },
  评论: { slug: '评论', nameZh: '评论', nameEn: 'Comment' },
  comment: { slug: '评论', nameZh: '评论', nameEn: 'Comment' },
  域名: { slug: '域名', nameZh: '域名', nameEn: 'Domain Name' },
  'domain name': { slug: '域名', nameZh: '域名', nameEn: 'Domain Name' }
}

const prisma = new PrismaClient()

function normalizeKey(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function slugify(value) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'tag'
  )
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function parseFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)

  if (!match) {
    throw new Error('缺少 front matter')
  }

  const data = {}
  let currentKey = null

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) {
      continue
    }

    const item = line.match(/^\s*-\s+(.*)$/)

    if (item && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = []
      }

      data[currentKey].push(unquote(item[1].trim()))
      continue
    }

    const field = line.match(/^([A-Za-z0-9_-]+):[ \t]*(.*)$/)

    if (field) {
      currentKey = field[1].toLowerCase()
      data[currentKey] = field[2].trim() ? unquote(field[2].trim()) : null
      continue
    }

    if (currentKey && typeof data[currentKey] === 'string') {
      data[currentKey] = `${data[currentKey]} ${line.trim()}`.trim()
    }
  }

  return { data, body: text.slice(match[0].length).trim() }
}

function assetUrl(reference, baseDir, slug) {
  if (/^(https?:|data:|mailto:|#)/.test(reference) || reference.startsWith('/')) {
    return reference
  }

  const clean = decodeURIComponent(reference.split(/[?#]/)[0])
  const file = path.join(baseDir, clean)

  if (!fs.existsSync(file)) {
    return reference
  }

  return `/blog-assets/${slug}/${clean.split(path.sep).join('/')}`
}

function rewriteAssets(source, baseDir, slug) {
  let inFence = false

  return source
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence
        return line
      }

      if (inFence) {
        return line
      }

      return line
        .replace(
          /(!\[[^\]]*\]\()([^)\s]+)(\s+"[^"]*")?(\))/g,
          (whole, open, ref, title, close) => `${open}${assetUrl(ref, baseDir, slug)}${title ?? ''}${close}`
        )
        .replace(
          /(<(?:img|video|source|audio)\b[^>]*?\s(?:src|poster)=["'])([^"']+)(["'])/g,
          (whole, open, ref, close) => `${open}${assetUrl(ref, baseDir, slug)}${close}`
        )
    })
    .join('\n')
}

function collectSources() {
  const dirs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  const sources = []

  for (const dir of dirs) {
    const baseDir = path.join(contentDir, dir)

    for (const [file, lang] of [
      ['index.zh-cn.md', 'zh'],
      ['index.en.md', 'en']
    ]) {
      const fullPath = path.join(baseDir, file)

      if (!fs.existsSync(fullPath)) {
        console.warn(`跳过缺失文件: ${path.join(dir, file)}`)
        continue
      }

      const parsed = parseFrontMatter(fs.readFileSync(fullPath, 'utf8'))
      const slug = String(parsed.data.slug ?? '').trim()

      if (!slug) {
        throw new Error(`缺少 slug: ${path.join(dir, file)}`)
      }

      sources.push({ dir, baseDir, lang, slug, ...parsed })
    }
  }

  return sources
}

function copyAssets(sources) {
  const seen = new Map()

  for (const source of sources) {
    seen.set(source.dir, source.slug)
  }

  let count = 0

  for (const [dir, slug] of seen) {
    const from = path.join(contentDir, dir)
    const to = path.join(assetDir, slug)

    fs.mkdirSync(to, { recursive: true })
    fs.cpSync(from, to, {
      recursive: true,
      filter: (file) => !file.endsWith('.md')
    })
    count += 1
  }

  return count
}

async function resolveCategory(name) {
  const key = normalizeKey(name)
  const def = CATEGORY_DEFS[key] ?? {
    slug: slugify(name),
    nameZh: name,
    nameEn: name
  }

  return prisma.category.upsert({
    where: { slug: def.slug },
    update: {},
    create: def
  })
}

async function resolveTag(name) {
  const key = normalizeKey(name)
  const def = TAG_DEFS[key] ?? {
    slug: slugify(name),
    nameZh: name,
    nameEn: name
  }

  return prisma.tag.upsert({
    where: { slug: def.slug },
    update: {},
    create: def
  })
}

async function main() {
  const sources = collectSources()
  const copied = copyAssets(sources)
  const report = { created: 0, updated: 0, posts: [], assetsDirs: copied }

  for (const source of sources) {
    const categoryName = Array.isArray(source.data.categories) ? source.data.categories[0] : source.data.categories
    const category = await resolveCategory(categoryName ?? 'technology')
    const tagNames = Array.isArray(source.data.tags) ? source.data.tags : []
    const tags = []

    for (const name of tagNames) {
      const tag = await resolveTag(name)

      if (!tags.some((item) => item.id === tag.id)) {
        tags.push(tag)
      }
    }

    const language = source.lang
    const slug = source.slug
    const title = String(source.data.title ?? '').trim()
    const publishedAt = new Date(String(source.data.date ?? ''))
    const contentMd = rewriteAssets(source.body, source.baseDir, slug)
    const existing = await prisma.post.findUnique({
      where: { lang_slug: { lang: language, slug } },
      select: { id: true, excerpt: true, contentMd: true }
    })
    const description = String(source.data.description ?? '').trim()
    const excerpt = description || existing?.excerpt || ''

    if (Number.isNaN(publishedAt.getTime())) {
      throw new Error(`日期无效: ${source.dir}/${language}`)
    }

    const post = await prisma.$transaction(async (tx) => {
      const saved = await tx.post.upsert({
        where: { lang_slug: { lang: language, slug } },
        create: {
          slug,
          lang: language,
          title,
          excerpt,
          contentMd,
          categoryId: category.id,
          status: 'published',
          publishedAt
        },
        update: {
          title,
          excerpt,
          contentMd,
          categoryId: category.id,
          status: 'published',
          publishedAt
        }
      })

      await tx.postTag.deleteMany({ where: { postId: saved.id } })

      if (tags.length) {
        await tx.postTag.createMany({
          data: tags.map((tag) => ({ postId: saved.id, tagId: tag.id }))
        })
      }

      return saved
    })

    const status = existing ? 'updated' : 'created'
    report[status] += 1
    report.posts.push({
      lang: language,
      slug,
      title,
      category: category.slug,
      tags: tags.map((tag) => tag.slug),
      contentChanged: !existing || existing.contentMd !== contentMd
    })

    console.log(`[${status}] ${language} ${slug} → ${category.slug} (${tags.length} tags)`)
    void post
  }

  console.log(`\n完成: 新建 ${report.created} 篇，更新 ${report.updated} 篇，复制 ${copied} 个文章资源目录到 ${assetDir}`)

  const reportFile = path.resolve('data/legacy/import-repo-report.json')
  fs.mkdirSync(path.dirname(reportFile), { recursive: true })
  fs.writeFileSync(
    reportFile,
    `${JSON.stringify({ importedAt: new Date().toISOString(), repo: repoDir, ...report }, null, 2)}\n`
  )
  console.log(`报告: ${reportFile}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
