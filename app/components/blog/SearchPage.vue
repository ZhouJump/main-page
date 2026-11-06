<script setup lang="ts">
import type { PostList } from '~/types/blog'

const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const route = useRoute()
const router = useRouter()
const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))
const keyword = computed(() => String(route.query.keyword ?? '').trim())
const input = ref(keyword.value)

const { data } = await useFetch<PostList>('/api/blog/search', {
  key: () => `blog-search-${props.lang}-${keyword.value}`,
  query: computed(() => ({ lang: props.lang, keyword: keyword.value }))
})

function submit() {
  router.push({ query: input.value.trim() ? { keyword: input.value.trim() } : {} })
}

useSeoMeta({
  title: () => (props.lang === 'en' ? 'Search · zhoujump' : '搜索 · zhoujump')
})
</script>

<template>
  <div class="www-container">
    <header class="border-b border-paper/10 py-14 lg:py-20">
      <NuxtLink :to="`${prefix}/`" class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper">
        ← {{ lang === 'en' ? 'ALL POSTS' : '全部文章' }}
      </NuxtLink>

      <h1 class="mt-6 font-display text-4xl leading-[0.95] font-semibold tracking-tight md:text-7xl">
        <span class="hero-line-mask"><span data-hero-line>{{ lang === 'en' ? 'Search' : '搜索' }}</span></span>
      </h1>

      <form class="mt-8 flex max-w-xl gap-3" @submit.prevent="submit">
        <input
          v-model="input"
          type="search"
          :placeholder="lang === 'en' ? 'Keyword…' : '输入关键词…'"
          class="min-w-0 flex-1 border border-paper/15 bg-transparent px-4 py-3 font-mono text-sm text-paper outline-none transition placeholder:text-muted/60 focus:border-brand-500"
        />
        <button type="submit" class="border border-brand-500 bg-brand-500 px-5 py-3 font-mono text-[11px] tracking-[0.14em] text-white transition hover:bg-brand-600">
          SEARCH
        </button>
      </form>
    </header>

    <section class="py-10">
      <p v-if="keyword" class="mb-2 font-mono text-[11px] text-muted">
        {{ data?.total ?? 0 }} {{ lang === 'en' ? 'RESULTS FOR' : '条结果' }}
        <span class="text-paper">“{{ keyword }}”</span>
      </p>

      <BlogPostListItem v-for="post in data?.posts ?? []" :key="post.id" :post="post" :lang="lang" />

      <div v-if="keyword && data && !data.posts.length" class="py-16 font-mono text-xs text-muted">
        {{ lang === 'en' ? 'Nothing found. Try another keyword.' : '没有找到相关文章，换个关键词试试。' }}
      </div>
    </section>
  </div>
</template>
