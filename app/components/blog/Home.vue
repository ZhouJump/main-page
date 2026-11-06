<script setup lang="ts">
import type { PostList, Taxonomy } from '~/types/blog'

const props = withDefaults(
  defineProps<{
    lang: 'zh' | 'en'
    page?: number
  }>(),
  {
    page: 1
  }
)

const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))

const { data, pending } = await useFetch<PostList>('/api/blog/posts', {
  key: () => `blog-feed-${props.lang}-${props.page}`,
  query: computed(() => ({ lang: props.lang, page: props.page }))
})

const posts = computed(() => data.value?.posts ?? [])
const pageCount = computed(() => data.value?.pageCount ?? 1)

const { data: taxonomy } = useFetch<Taxonomy>('/api/blog/taxonomy', {
  key: () => `blog-taxonomy-${props.lang}`,
  query: { lang: props.lang }
})

useSeoMeta({
  title: () => (props.lang === 'en' ? 'zhoujump · journal' : 'zhoujump · 手记'),
  description: () =>
    props.lang === 'en'
      ? 'Notes on frontend engineering, CSS, Vue and building things.'
      : '前端工程、CSS、Vue 与产品实现的手记。'
})
</script>

<template>
  <div class="www-container">
    <section class="border-b border-paper/10 py-16 lg:py-24">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p class="font-mono text-[10px] tracking-[0.3em] text-brand-500" data-hero>JOURNAL / {{ lang === 'en' ? 'EN' : 'ZH' }}</p>
          <h1 class="mt-5 font-display text-4xl leading-[0.95] font-semibold tracking-tight md:text-7xl">
            <span class="hero-line-mask"><span data-hero-line>{{ lang === 'en' ? 'Notes from the build.' : '把过程写下来。' }}</span></span>
          </h1>
          <p class="mt-5 max-w-xl text-sm leading-7 text-muted" data-hero>
            {{ lang === 'en' ? 'Frontend engineering, CSS, Vue and the making of things.' : '前端工程、CSS、Vue，以及把想法做出来的过程。' }}
          </p>
        </div>

        <div class="flex items-center gap-4 font-mono text-[10px] tracking-[0.18em] text-muted">
          <a :href="`${prefix}/index.xml`" class="transition hover:text-paper">RSS</a>
        </div>
      </div>
    </section>

    <div class="blog-home-grid grid gap-10 py-10">
      <section>
        <div v-if="pending" class="space-y-8">
          <div v-for="index in 3" :key="index" class="h-28 animate-pulse border-b border-paper/10" />
        </div>

        <template v-else>
          <BlogPostListItem v-for="post in posts" :key="post.id" :post="post" :lang="lang" />

          <div v-if="!posts.length" class="py-16 font-mono text-xs text-muted">暂无文章。</div>

          <BlogPagination v-else :page="page" :page-count="pageCount" :base="`${prefix}/`" class="mt-10" />
        </template>
      </section>

      <aside class="blog-lg-aside blog-taxonomy space-y-10">
        <section v-if="taxonomy">
          <h2 class="font-mono text-[10px] tracking-[0.24em] text-muted">CATEGORIES</h2>
          <ul class="mt-4 space-y-2">
            <li v-for="category in taxonomy.categories" :key="category.id">
              <NuxtLink
                :to="`${prefix}/categories/${category.slug}/`"
                class="flex items-baseline justify-between gap-4 border-b border-paper/10 pb-2 text-sm transition hover:text-brand-500"
              >
                <span>{{ category.name }}</span>
                <span class="font-mono text-[10px] text-muted">{{ category.count }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>

        <section v-if="taxonomy">
          <h2 class="font-mono text-[10px] tracking-[0.24em] text-muted">TAGS</h2>
          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in taxonomy.tags"
              :key="tag.id"
              :to="`${prefix}/tags/${encodeURIComponent(tag.slug)}/`"
              class="rounded-full border border-paper/15 px-2.5 font-mono text-[10px] text-muted transition hover:border-brand-500 hover:text-paper"
              :class="lang === 'zh' ? 'py-1.5' : 'py-1'"
            >
              #{{ tag.name }} · {{ tag.count }}
            </NuxtLink>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>
