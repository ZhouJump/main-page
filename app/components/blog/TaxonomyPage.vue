<script setup lang="ts">
import type { Taxonomy } from '~/types/blog'

const props = defineProps<{
  lang: 'zh' | 'en'
  kind: 'category' | 'tag'
}>()

const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))
const plural = computed(() => (props.kind === 'category' ? 'categories' : 'tags'))
const heading = computed(() =>
  props.kind === 'category'
    ? props.lang === 'en'
      ? 'Categories'
      : '分类'
    : props.lang === 'en'
      ? 'Tags'
      : '标签'
)

const { data } = useFetch<Taxonomy>('/api/blog/taxonomy', {
  key: () => `blog-taxonomy-${props.lang}`,
  query: { lang: props.lang }
})

useSeoMeta({
  title: () => `${heading.value} · zhoujump`
})
</script>

<template>
  <div class="www-container">
    <header class="border-b border-paper/10 py-14 lg:py-20">
      <NuxtLink :to="`${prefix}/`" class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper">
        ← {{ lang === 'en' ? 'ALL POSTS' : '全部文章' }}
      </NuxtLink>
      <h1 class="mt-6 font-display text-4xl leading-[0.95] font-semibold tracking-tight md:text-7xl">
        <span class="hero-line-mask"><span data-hero-line>{{ heading }}</span></span>
      </h1>
    </header>

    <div v-if="kind === 'category'" class="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="category in data?.categories ?? []"
        :key="category.id"
        :to="`${prefix}/categories/${category.slug}/`"
        class="group flex min-h-40 flex-col justify-between border border-paper/10 p-5 transition hover:border-brand-500"
      >
        <span class="font-mono text-[10px] text-muted">{{ category.count }} POSTS</span>
        <span class="mt-8 font-display text-2xl font-semibold leading-tight group-hover:text-brand-500">{{ category.name }}</span>
      </NuxtLink>
    </div>

    <div v-else class="flex flex-wrap gap-3 py-10">
      <NuxtLink
        v-for="tag in data?.tags ?? []"
        :key="tag.id"
        :to="`${prefix}/tags/${encodeURIComponent(tag.slug)}/`"
        class="rounded-full border border-paper/15 px-4 py-2 font-mono text-xs text-muted transition hover:border-brand-500 hover:text-paper"
      >
        #{{ tag.name }} <span class="ml-1 opacity-60">{{ tag.count }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
