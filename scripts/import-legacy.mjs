import fs from 'node:fs/promises'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const DATA_FILE = path.resolve('data/legacy/posts.json')
const REPORT_FILE = path.resolve('data/legacy/import-report.json')

function cleanExcerpt(value) {
  return value.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)
}

async function main() {
  const dataset = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))

  const categoryIds = new Map()

  for (const category of dataset.categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { nameZh: category.nameZh, nameEn: category.nameEn },
      create: {
        slug: category.slug,
        nameZh: category.nameZh,
        nameEn: category.nameEn
      }
    })
    categoryIds.set(category.slug, row.id)
  }

  const tagIds = new Map()

  for (const tag of dataset.tags) {
    const row = await prisma.tag.upsert({
      where: { slug: tag.slugZh },
      update: { nameZh: tag.nameZh, nameEn: tag.nameEn },
      create: { slug: tag.slugZh, nameZh: tag.nameZh, nameEn: tag.nameEn }
    })
    tagIds.set(tag.slugZh, row.id)
  }

  const report = []

  for (const post of dataset.posts) {
    const primaryCategory = post.categories[0]
    const categoryId = primaryCategory ? categoryIds.get(primaryCategory.slug) : undefined

    if (!categoryId) {
      throw new Error(`文章缺少分类: ${post.lang}/${post.slug}`)
    }

    const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date()

    const saved = await prisma.post.upsert({
      where: { lang_slug: { lang: post.lang, slug: post.slug } },
      update: {
        title: post.title,
        excerpt: cleanExcerpt(post.excerpt),
        contentMd: post.contentMd,
        categoryId,
        status: 'published',
        publishedAt
      },
      create: {
        slug: post.slug,
        lang: post.lang,
        title: post.title,
        excerpt: cleanExcerpt(post.excerpt),
        contentMd: post.contentMd,
        categoryId,
        status: 'published',
        publishedAt
      }
    })

    await prisma.postTag.deleteMany({ where: { postId: saved.id } })

    const tagLinks = post.tags
      .map((tag) => {
        const tagId = tagIds.get(tag.slug)
        return tagId ? { postId: saved.id, tagId } : null
      })
      .filter(Boolean)

    if (tagLinks.length > 0) {
      await prisma.postTag.createMany({ data: tagLinks, skipDuplicates: true })
    }

    report.push({
      lang: post.lang,
      slug: post.slug,
      title: post.title,
      url: `/p/${post.slug}/`,
      publishedAt: publishedAt.toISOString(),
      category: primaryCategory?.slug ?? '',
      categories: post.categories.map((item) => item.slug),
      tags: post.tags.map((item) => item.slug),
      characters: post.contentMd.length
    })
  }

  const [posts, categories, tags] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count()
  ])

  await fs.writeFile(
    REPORT_FILE,
    JSON.stringify(
      {
        importedAt: new Date().toISOString(),
        counts: { posts, categories, tags },
        posts: report
      },
      null,
      2
    )
  )

  console.log(`导入完成: 文章 ${posts}，分类 ${categories}，标签 ${tags}`)
  console.log(`报告: ${REPORT_FILE}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
