<script setup lang="ts">
import type { AdminOverview } from '~/types/admin'

definePageMeta({ layout: 'admin' })

const { data } = await useFetch<AdminOverview>('/api/admin/overview')
</script>

<template>
  <div v-if="data">
    <p class="font-mono text-[10px] tracking-[0.24em] text-brand-500">DASHBOARD</p>
    <h1 class="mt-2 font-display text-4xl font-semibold tracking-tight">概览</h1>

    <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="border border-paper/10 p-5">
        <p class="font-mono text-[10px] text-muted">POSTS</p>
        <p class="mt-3 font-display text-4xl font-semibold">{{ data.posts.total }}</p>
        <p class="mt-1 text-xs text-muted">{{ data.posts.published }} 已发布 / {{ data.posts.drafts }} 草稿</p>
      </div>
      <div class="border border-paper/10 p-5">
        <p class="font-mono text-[10px] text-muted">COMMENTS</p>
        <p class="mt-3 font-display text-4xl font-semibold">{{ data.comments }}</p>
        <NuxtLink to="/admin/comments" class="mt-1 inline-block text-xs text-muted hover:text-brand-500">管理评论 →</NuxtLink>
      </div>
      <div class="border border-paper/10 p-5">
        <p class="font-mono text-[10px] text-muted">CATEGORIES</p>
        <p class="mt-3 font-display text-4xl font-semibold">{{ data.categories }}</p>
        <NuxtLink to="/admin/categories" class="mt-1 inline-block text-xs text-muted hover:text-brand-500">管理分类 →</NuxtLink>
      </div>
      <div class="border border-paper/10 p-5">
        <p class="font-mono text-[10px] text-muted">TAGS</p>
        <p class="mt-3 font-display text-4xl font-semibold">{{ data.tags }}</p>
        <NuxtLink to="/admin/tags" class="mt-1 inline-block text-xs text-muted hover:text-brand-500">管理标签 →</NuxtLink>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
      <NuxtLink
        to="/admin/posts/new"
        class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500"
      >
        写新文章
      </NuxtLink>
      <NuxtLink
        to="/admin/posts"
        class="border border-paper/15 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper"
      >
        全部文章
      </NuxtLink>
    </div>

    <section class="mt-12">
      <h2 class="font-mono text-[10px] tracking-[0.24em] text-muted">RECENT COMMENTS</h2>

      <ul v-if="data.recentComments.length" class="mt-4 divide-y divide-paper/10 border-y border-paper/10">
        <li v-for="comment in data.recentComments" :key="comment.id" class="py-4">
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-sm font-medium">{{ comment.nickname }}</span>
            <span class="font-mono text-[10px]" :class="comment.status === 'visible' ? 'text-brand-500' : 'text-muted'">
              {{ comment.status }}
            </span>
            <span class="font-mono text-[10px] text-muted">{{ comment.post.title }}</span>
          </div>
          <p class="mt-2 line-clamp-2 text-sm text-muted">{{ comment.content }}</p>
        </li>
      </ul>

      <p v-else class="mt-4 text-sm text-muted">暂无评论。</p>
    </section>
  </div>
</template>
