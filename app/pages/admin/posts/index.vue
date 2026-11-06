<script setup lang="ts">
import type { AdminPostList } from '~/types/admin'

definePageMeta({ layout: 'admin' })

const status = ref('')
const keyword = ref('')
const page = ref(1)

const query = computed(() => ({
  status: status.value,
  keyword: keyword.value,
  page: page.value
}))

const { data, refresh } = await useFetch<AdminPostList>('/api/admin/posts', { query })

watch([status, keyword], () => {
  page.value = 1
})

async function remove(ids: number[], title: string) {
  if (!window.confirm(`确定删除《${title}》的中英文版本？此操作不可恢复。`)) {
    return
  }

  await Promise.all(ids.map((id) => $fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })))
  await refresh()
}

function publicUrl(slug: string, lang: 'zh' | 'en') {
  return lang === 'en' ? `/en/blog/p/${slug}/` : `/blog/p/${slug}/`
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="font-mono text-[10px] tracking-[0.24em] text-brand-500">CONTENT</p>
        <h1 class="mt-2 font-display text-4xl font-semibold tracking-tight">文章</h1>
      </div>
      <NuxtLink
        to="/admin/posts/new"
        class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500"
      >
        写新文章
      </NuxtLink>
    </div>

    <div class="mt-8 flex flex-wrap gap-3">
      <select v-model="status" class="border border-paper/15 bg-ink-950 px-3 py-2 text-sm outline-none focus:border-brand-500">
        <option value="">全部状态</option>
        <option value="published">已发布</option>
        <option value="draft">草稿</option>
      </select>
      <input
        v-model="keyword"
        type="search"
        placeholder="搜索标题或 slug"
        class="min-w-52 flex-1 border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>

    <div v-if="data" class="mt-8 overflow-x-auto border border-paper/10">
      <table class="w-full min-w-[760px] text-left text-sm">
        <thead class="border-b border-paper/10 font-mono text-[10px] tracking-[0.18em] text-muted">
          <tr>
            <th class="px-4 py-3">TITLE</th>
            <th class="px-4 py-3">LANGS</th>
            <th class="px-4 py-3">STATUS</th>
            <th class="px-4 py-3">CATEGORY</th>
            <th class="px-4 py-3">UPDATED</th>
            <th class="px-4 py-3 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-paper/10">
          <tr v-for="post in data.posts" :key="post.id" class="transition hover:bg-paper/5">
            <td class="px-4 py-3">
              <NuxtLink :to="`/admin/posts/${post.id}`" class="font-medium transition hover:text-brand-500">
                {{ post.title }}
              </NuxtLink>
              <p class="mt-0.5 font-mono text-[10px] text-muted">{{ post.slug }}</p>
            </td>
            <td class="px-4 py-3">
              <span class="mr-1 font-mono text-[10px]" :class="post.translations.zh ? 'text-brand-500' : 'text-muted/40'">中</span>
              <span class="font-mono text-[10px]" :class="post.translations.en ? 'text-brand-500' : 'text-muted/40'">EN</span>
            </td>
            <td class="px-4 py-3">
              <span class="font-mono text-[10px]" :class="post.status === 'published' ? 'text-brand-500' : 'text-muted'">
                {{ post.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-xs text-muted">{{ post.category.nameZh }}</td>
            <td class="px-4 py-3 font-mono text-[10px] text-muted">{{ formatDate(post.updatedAt, 'zh') }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-3 font-mono text-[10px]">
                <a
                  v-if="post.translations.zh"
                  :href="publicUrl(post.slug, 'zh')"
                  target="_blank"
                  rel="noopener"
                  class="text-muted transition hover:text-paper"
                >查看</a>
                <a
                  v-if="post.translations.en"
                  :href="publicUrl(post.slug, 'en')"
                  target="_blank"
                  rel="noopener"
                  class="text-muted transition hover:text-paper"
                >EN</a>
                <NuxtLink :to="`/admin/posts/${post.id}`" class="text-muted transition hover:text-brand-500">编辑</NuxtLink>
                <button class="text-muted transition hover:text-red-400" @click="remove(post.ids, post.title)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!data.posts.length">
            <td colspan="6" class="px-4 py-10 text-center text-sm text-muted">没有匹配的文章。</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="data && data.pageCount > 1" class="mt-6 flex items-center justify-between font-mono text-[10px] text-muted">
      <span>共 {{ data.total }} 篇 · 第 {{ data.page }} / {{ data.pageCount }} 页</span>
      <div class="flex gap-2">
        <button class="border border-paper/15 px-3 py-1.5 transition hover:text-paper disabled:opacity-40" :disabled="page <= 1" @click="page--">
          PREV
        </button>
        <button
          class="border border-paper/15 px-3 py-1.5 transition hover:text-paper disabled:opacity-40"
          :disabled="page >= data.pageCount"
          @click="page++"
        >
          NEXT
        </button>
      </div>
    </div>
  </div>
</template>
