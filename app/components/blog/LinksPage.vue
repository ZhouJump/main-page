<script setup lang="ts">
const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))

const links = computed(() => [
  { label: 'GitHub', href: 'https://github.com/zhoujump', note: '代码与实验' },
  { label: 'Email', href: 'mailto:x@zhoujump.com', note: '合作与交流' },
  { label: 'RSS', href: `${prefix.value}/index.xml`, note: '订阅手记' }
])

useSeoMeta({
  title: () => (props.lang === 'en' ? 'Links · zhoujump' : '链接 · zhoujump')
})
</script>

<template>
  <div class="www-container">
    <header class="border-b border-paper/10 py-14 lg:py-20">
      <NuxtLink :to="`${prefix}/`" class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper">
        ← {{ lang === 'en' ? 'ALL POSTS' : '全部文章' }}
      </NuxtLink>
      <h1 class="mt-6 font-display text-4xl leading-[0.95] font-semibold tracking-tight md:text-7xl">
        <span class="hero-line-mask"><span data-hero-line>{{ lang === 'en' ? 'Links' : '链接' }}</span></span>
      </h1>
    </header>

    <section class="grid gap-4 py-10 md:grid-cols-3">
      <a
        v-for="link in links"
        :key="link.label"
        :href="link.href"
        class="group flex min-h-40 flex-col justify-between border border-paper/10 p-5 transition hover:border-brand-500"
      >
        <span class="font-mono text-[10px] text-muted">{{ link.note }}</span>
        <span class="mt-8 font-display text-2xl font-semibold leading-tight group-hover:text-brand-500">{{ link.label }} ↗</span>
      </a>
    </section>
  </div>
</template>
