<script setup lang="ts">
import type { PostSummary } from '~/types/blog'

const props = defineProps<{
  post: PostSummary
  lang: 'zh' | 'en'
}>()

const prefix = computed(() => (props.lang === 'en' ? '/en/blog' : '/blog'))
const postUrl = computed(() => `${prefix.value}/p/${props.post.slug}/`)
const categoryName = computed(() => (props.lang === 'en' ? props.post.category.nameEn : props.post.category.nameZh))
const categoryUrl = computed(() => `${prefix.value}/categories/${props.post.category.slug}/`)
const titleColor = computed(() => props.post.category.titleColor || '#EFEFEB')
</script>

<template>
  <article class="group border-b border-paper/10 py-8">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-6">
      <NuxtLink
        :to="postUrl"
        class="relative block min-h-44 w-full shrink-0 overflow-hidden sm:min-h-48 sm:w-60 md:w-72"
        :class="post.category.imagePath ? 'bg-black' : 'bg-brand-500'"
      >
        <img
          v-if="post.category.imagePath"
          :src="post.category.imagePath"
          :alt="categoryName"
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div v-if="post.category.imagePath" class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <div class="relative flex h-full min-h-44 items-end p-4 sm:min-h-48 sm:p-5">
          <h2 class="font-display text-xl leading-[1.05] font-semibold tracking-tight md:text-2xl" :style="{ color: titleColor }">
            {{ post.title }}
          </h2>
        </div>
      </NuxtLink>

      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-muted">
          <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt, lang) }}</time>
          <span class="text-brand-500">/</span>
          <NuxtLink :to="categoryUrl" class="uppercase transition hover:text-paper">{{ categoryName }}</NuxtLink>
        </div>

        <NuxtLink v-if="post.excerpt" :to="postUrl" class="mt-3 block max-w-3xl text-sm leading-7 text-muted transition hover:text-paper/80">{{ post.excerpt }}</NuxtLink>

        <div v-if="post.tags.length" class="mt-auto flex flex-wrap gap-2 pt-4">
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
    </div>
  </article>
</template>
