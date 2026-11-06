<script setup lang="ts">
import type { PostList, Taxonomy } from '~/types/blog'

const props = withDefaults(
  defineProps<{
    lang: 'zh' | 'en'
    kind: 'category' | 'tag'
    slug: string
    page?: number
  }>(),
  {
    page: 1
  }
)

const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))
const plural = computed(() => (props.kind === 'category' ? 'categories' : 'tags'))
const base = computed(() => `${prefix.value}/${plural.value}/${encodeURIComponent(props.slug)}/`)

const { data, pending } = await useFetch<PostList>('/api/blog/posts', {
  key: () => `blog-list-${props.lang}-${props.kind}-${props.slug}-${props.page}`,
  query: computed(() => ({
    lang: props.lang,
    page: props.page,
    ...(props.kind === 'category' ? { category: props.slug } : { tag: props.slug })
  }))
})

const posts = computed(() => data.value?.posts ?? [])
const pageCount = computed(() => data.value?.pageCount ?? 1)

const { data: taxonomy } = useFetch<Taxonomy>('/api/blog/taxonomy', {
  key: () => `blog-taxonomy-${props.lang}`,
  query: { lang: props.lang }
})

const current = computed(() => {
  if (!taxonomy.value) {
    return null
  }

  const items = props.kind === 'category' ? taxonomy.value.categories : taxonomy.value.tags
  return items.find((item) => item.slug === props.slug) ?? null
})

const title = computed(() => current.value?.name ?? props.slug)
const heading = computed(() => {
  if (props.kind === 'category') {
    return props.lang === 'en' ? 'CATEGORY' : '分类'
  }

  return props.lang === 'en' ? 'TAG' : '标签'
})

const backLabel = computed(() => {
  if (props.lang === 'en') {
    return props.kind === 'category' ? 'ALL CATEGORIES' : 'ALL TAGS'
  }

  return props.kind === 'category' ? '所有分类' : '所有标签'
})

useSeoMeta({
  title: () => `${title.value} · zhoujump`,
  description: () => (props.kind === 'category' ? `${title.value} 分类下的文章。` : `#${title.value} 标签下的文章。`)
})
</script>

<template>
  <div class="www-container">
    <header class="border-b border-paper/10 py-14 lg:py-20">
      <div class="flex items-baseline gap-5">
        <NuxtLink :to="`${prefix}/${plural}/`" class="shrink-0 font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper">
          ← {{ backLabel }}
        </NuxtLink>

        <h1 class="min-w-0 font-display text-4xl leading-[0.95] font-semibold tracking-tight md:text-7xl">
          <span class="hero-line-mask"><span data-hero-line><span v-if="kind === 'tag'" class="text-muted">#</span>{{ title }}</span></span>
        </h1>
      </div>

      <p class="mt-4 font-mono text-[10px] tracking-[0.3em] text-brand-500">{{ heading }}<template v-if="current"> · {{ current.count }} POSTS</template></p>
    </header>

    <section class="py-10">
      <div v-if="pending" class="space-y-8">
        <div v-for="index in 3" :key="index" class="h-28 animate-pulse border-b border-paper/10" />
      </div>

      <template v-else>
        <BlogPostListItem v-for="post in posts" :key="post.id" :post="post" :lang="lang" />

        <div v-if="!posts.length" class="py-16 font-mono text-xs text-muted">
          {{ lang === 'en' ? 'No posts yet.' : '暂无文章。' }}
        </div>

        <BlogPagination v-else :page="page" :page-count="pageCount" :base="base" class="mt-10" />
      </template>
    </section>
  </div>
</template>
