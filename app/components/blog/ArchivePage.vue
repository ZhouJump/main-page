<script setup lang="ts">
interface ArchiveYear {
  year: number
  count: number
  posts: {
    slug: string
    title: string
    publishedAt: string
    category: { slug: string; nameZh: string; nameEn: string }
  }[]
}

const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))

const { data } = await useFetch<{ total: number; years: ArchiveYear[] }>('/api/blog/archives', {
  key: () => `blog-archives-${props.lang}`,
  query: { lang: props.lang }
})

useSeoMeta({
  title: () => (props.lang === 'en' ? 'Archive · zhoujump' : '归档 · zhoujump')
})
</script>

<template>
  <div class="www-container">
    <header class="border-b border-paper/10 py-14 lg:py-20">
      <NuxtLink :to="`${prefix}/`" class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper">
        ← {{ lang === 'en' ? 'ALL POSTS' : '全部文章' }}
      </NuxtLink>
      <h1 class="mt-6 font-display text-4xl leading-[0.95] font-semibold tracking-tight md:text-7xl">
        <span class="hero-line-mask"><span data-hero-line>{{ lang === 'en' ? 'Archive' : '归档' }}</span></span>
      </h1>
      <p class="mt-4 font-mono text-[11px] text-muted" data-hero>{{ data?.total ?? 0 }} POSTS</p>
    </header>

    <section class="py-6">
      <div v-for="group in data?.years ?? []" :key="group.year" class="grid gap-6 border-b border-paper/10 py-8 md:grid-cols-[120px_minmax(0,1fr)]">
        <div class="flex items-baseline gap-3">
          <span class="font-display text-3xl font-semibold">{{ group.year }}</span>
          <span class="font-mono text-[10px] text-muted">{{ group.count }}</span>
        </div>

        <div class="space-y-3">
          <NuxtLink
            v-for="post in group.posts"
            :key="post.slug"
            :to="`${prefix}/p/${post.slug}/`"
            class="group flex flex-wrap items-baseline justify-between gap-3 border-b border-paper/5 pb-3"
          >
            <span class="font-display text-lg font-medium leading-tight group-hover:text-brand-500">{{ post.title }}</span>
            <span class="font-mono text-[10px] text-muted">{{ formatDate(post.publishedAt, lang) }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
