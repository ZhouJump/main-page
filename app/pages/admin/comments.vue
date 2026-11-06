<script setup lang="ts">
import type { AdminCommentList } from '~/types/admin'

definePageMeta({ layout: 'admin' })

const status = ref('')
const keyword = ref('')
const page = ref(1)

const query = computed(() => ({ status: status.value, keyword: keyword.value, page: page.value }))
const { data, refresh } = await useFetch<AdminCommentList>('/api/admin/comments', { query })

watch([status, keyword], () => {
  page.value = 1
})

async function toggle(comment: { id: number; status: string }) {
  const next = comment.status === 'visible' ? 'hidden' : 'visible'
  await $fetch(`/api/admin/comments/${comment.id}`, { method: 'PUT', body: { status: next } })
  await refresh()
}

async function remove(id: number) {
  if (!window.confirm('确定删除该评论？')) {
    return
  }

  await $fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <p class="font-mono text-[10px] tracking-[0.24em] text-brand-500">MODERATION</p>
    <h1 class="mt-2 font-display text-4xl font-semibold tracking-tight">评论</h1>

    <div v-if="data" class="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-muted">
      <span>全部 {{ data.total }}</span>
      <span class="text-brand-500">显示 {{ data.counts.visible }}</span>
      <span>隐藏 {{ data.counts.hidden }}</span>
    </div>

    <div class="mt-8 flex flex-wrap gap-3">
      <select v-model="status" class="border border-paper/15 bg-ink-950 px-3 py-2 text-sm outline-none focus:border-brand-500">
        <option value="">全部状态</option>
        <option value="visible">显示</option>
        <option value="hidden">隐藏</option>
      </select>
      <input
        v-model="keyword"
        type="search"
        placeholder="搜索昵称或内容"
        class="min-w-52 flex-1 border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>

    <ul v-if="data" class="mt-8 divide-y divide-paper/10 border-y border-paper/10">
      <li v-for="comment in data.comments" :key="comment.id" class="py-5">
        <div class="flex gap-4">
          <img
            v-if="comment.avatar"
            :src="comment.avatar"
            alt=""
            class="h-9 w-9 shrink-0 rounded-full border border-paper/10"
          />
          <div v-else class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/10 text-xs">
            {{ comment.nickname.slice(0, 1).toUpperCase() }}
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="text-sm font-medium">{{ comment.nickname }}</span>
              <span class="font-mono text-[10px]" :class="comment.status === 'visible' ? 'text-brand-500' : 'text-muted'">
                {{ comment.status }}
              </span>
              <span class="font-mono text-[10px] text-muted">{{ formatDate(comment.createdAt, 'zh') }}</span>
              <a
                :href="comment.post.lang === 'en' ? `https://www.zhoujump.com/en/blog/p/${comment.post.slug}/` : `https://www.zhoujump.com/blog/p/${comment.post.slug}/`"
                target="_blank"
                rel="noopener"
                class="max-w-full truncate font-mono text-[10px] text-muted underline-offset-2 transition hover:text-paper hover:underline"
              >
                {{ comment.post.title }}
              </a>
            </div>

            <p class="mt-2 text-sm leading-6 whitespace-pre-wrap break-words text-muted">{{ comment.content }}</p>

            <div class="mt-3 flex gap-4 font-mono text-[10px]">
              <button class="text-muted transition hover:text-brand-500" @click="toggle(comment)">
                {{ comment.status === 'visible' ? '隐藏' : '显示' }}
              </button>
              <button class="text-muted transition hover:text-red-400" @click="remove(comment.id)">删除</button>
            </div>
          </div>
        </div>
      </li>
      <li v-if="!data.comments.length" class="py-10 text-center text-sm text-muted">没有匹配的评论。</li>
    </ul>

    <div v-if="data && data.pageCount > 1" class="mt-6 flex items-center justify-between font-mono text-[10px] text-muted">
      <span>第 {{ data.page }} / {{ data.pageCount }} 页</span>
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
