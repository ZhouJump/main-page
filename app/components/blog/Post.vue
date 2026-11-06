<script setup lang="ts">
import type { PostDetail } from '~/types/blog'

const props = defineProps<{
  lang: 'zh' | 'en'
  slug: string
}>()

const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))
const postUrl = computed(() => `${prefix.value}/p/${props.slug}/`)

const { data, error } = await useFetch<PostDetail>('/api/blog/post', {
  key: () => `blog-post-${props.lang}-${props.slug}`,
  query: { lang: props.lang, slug: props.slug },
  watch: false
})

if (error.value || !data.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 404,
    statusMessage: '文章不存在'
  })
}

const post = computed(() => data.value as PostDetail)
const categoryName = computed(() => (props.lang === 'en' ? post.value.category.nameEn : post.value.category.nameZh))
const categoryUrl = computed(() => `${prefix.value}/categories/${post.value.category.slug}/`)
const siteBase = String(useRuntimeConfig().public.siteWwwUrl).replace(/\/$/, '')

const heroStyle = computed(() => {
  const image = post.value.category.imagePath

  if (!image) {
    return undefined
  }

  return {
    backgroundImage: `linear-gradient(180deg, rgba(7, 7, 7, 0.6) 0%, rgba(7, 7, 7, 0.72) 45%, rgba(7, 7, 7, 0.94) 100%), url("${image}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

useSeoMeta({
  title: () => post.value.title,
  description: () => post.value.excerpt,
  ogType: 'article',
  articlePublishedTime: () => post.value.publishedAt,
  ogUrl: () => `${siteBase}${postUrl.value}`
})

useHead({
  link: computed(() => {
    const current = `${siteBase}${postUrl.value}`
    const zh = `${siteBase}/blog/p/${props.slug}/`

    if (!post.value.translationSlug) {
      return [
        { rel: 'alternate', hreflang: props.lang === 'en' ? 'en' : 'zh-CN', href: current },
        { rel: 'alternate', hreflang: 'x-default', href: zh }
      ]
    }

    return [
      { rel: 'alternate', hreflang: 'zh-CN', href: zh },
      { rel: 'alternate', hreflang: 'en', href: `${siteBase}/en/blog/p/${post.value.translationSlug}/` },
      { rel: 'alternate', hreflang: 'x-default', href: zh }
    ]
  }),
  script: computed(() => [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        description: post.value.excerpt,
        datePublished: post.value.publishedAt,
        dateModified: post.value.publishedAt,
        inLanguage: props.lang === 'en' ? 'en' : 'zh-CN',
        mainEntityOfPage: `${siteBase}${postUrl.value}`,
        author: { '@type': 'Person', name: '周楚杰', url: 'https://www.zhoujump.com/' },
        publisher: { '@type': 'Person', name: '周楚杰', url: 'https://www.zhoujump.com/' }
      })
    }
  ])
})

const progress = ref(0)
const activeHeading = ref('')
let scrollHandler: (() => void) | null = null

onMounted(() => {
  const headings = post.value.toc
    .map((item) => document.getElementById(item.id))
    .filter((el): el is HTMLElement => Boolean(el))

  scrollHandler = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0

    let current = headings[0]?.id ?? ''
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= 160) current = heading.id
    }
    activeHeading.value = current
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
  scrollHandler()
})

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <div>
    <div class="fixed inset-x-0 top-0 z-[1003] h-0.5 bg-transparent">
      <div class="h-full bg-brand-500 transition-[width] duration-150" :style="{ width: `${progress}%` }" />
    </div>

    <header class="blog-hero" :style="heroStyle">
      <div class="www-container">
        <h1 class="blog-hero_title" :style="{ color: post.category.titleColor }" data-hero>{{ post.title }}</h1>

        <p v-if="post.excerpt" class="mt-5 max-w-2xl text-sm leading-7 text-muted" data-hero>{{ post.excerpt }}</p>

        <div class="mt-6 flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-muted" data-hero>
          <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt, lang) }}</time>
          <span class="text-brand-500">/</span>
          <NuxtLink :to="categoryUrl" class="uppercase transition hover:text-paper">{{ categoryName }}</NuxtLink>
          <span class="text-brand-500">/</span>
          <span>{{ post.readingMinutes }} MIN READ</span>
        </div>

        <div v-if="post.tags.length" class="mt-6 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag.id"
            :to="`${prefix}/tags/${encodeURIComponent(tag.slug)}/`"
            class="rounded-full border border-paper/15 px-2.5 font-mono text-[10px] text-muted transition hover:border-brand-500 hover:text-paper"
            :class="lang === 'zh' ? 'py-1.5' : 'py-1'"
          >
            #{{ lang === 'en' ? tag.nameEn : tag.nameZh }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="www-container">
      <div class="blog-post-grid grid w-full gap-12 py-12 lg:py-16">
        <article class="min-w-0 max-w-4xl">
          <div class="article-body" v-html="post.html" />

          <div class="mt-14 grid gap-4 border-t border-paper/10 pt-8 md:grid-cols-2">
            <NuxtLink
              v-if="post.newer"
              :to="`${prefix}/p/${post.newer.slug}/`"
              class="group border border-paper/10 p-5 transition hover:border-brand-500"
            >
              <span class="font-mono text-[10px] tracking-[0.18em] text-muted">NEWER</span>
              <p class="mt-2 font-display text-lg leading-tight font-semibold group-hover:text-brand-500">{{ post.newer.title }}</p>
            </NuxtLink>
            <span v-else />

            <NuxtLink
              v-if="post.older"
              :to="`${prefix}/p/${post.older.slug}/`"
              class="group border border-paper/10 p-5 text-right transition hover:border-brand-500"
            >
              <span class="font-mono text-[10px] tracking-[0.18em] text-muted">OLDER</span>
              <p class="mt-2 font-display text-lg leading-tight font-semibold group-hover:text-brand-500">{{ post.older.title }}</p>
            </NuxtLink>
          </div>

          <section v-if="post.related.length" class="mt-14">
            <h2 class="font-mono text-[10px] tracking-[0.24em] text-muted">RELATED</h2>
            <div class="mt-4 grid gap-3 md:grid-cols-3">
              <NuxtLink
                v-for="item in post.related"
                :key="item.id"
                :to="`${prefix}/p/${item.slug}/`"
                class="group border border-paper/10 p-4 transition hover:border-brand-500"
              >
                <p class="font-display text-base leading-tight font-semibold group-hover:text-brand-500">{{ item.title }}</p>
                <p class="mt-2 font-mono text-[10px] text-muted">{{ formatDate(item.publishedAt, lang) }}</p>
              </NuxtLink>
            </div>
          </section>

          <BlogComments :lang="lang" :slug="slug" />
        </article>

        <aside class="blog-lg-aside blog-toc">
          <nav v-if="post.toc.length" class="sticky top-28">
            <p class="font-mono text-[10px] tracking-[0.24em] text-muted">CONTENTS</p>
            <ol class="mt-3 space-y-1 text-sm text-muted">
              <li v-for="item in post.toc" :key="item.id">
                <a
                  :href="`#${item.id}`"
                  class="toc-link block border-l-2 border-transparent py-1 text-[13px] leading-snug transition hover:text-paper"
                  :class="[item.level === 3 ? 'pl-6' : 'pl-3', { 'is-active': activeHeading === item.id }]"
                >
                  {{ item.text }}
                </a>
              </li>
            </ol>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>
