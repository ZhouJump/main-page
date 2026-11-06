<script setup lang="ts">
import type { AdminTag } from '~/types/admin'

definePageMeta({ layout: 'admin' })

const { data, refresh } = await useFetch<{ tags: AdminTag[] }>('/api/admin/tags')

const panelOpen = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const error = ref('')

const form = reactive({
  nameZh: '',
  nameEn: '',
  slug: ''
})

function reset() {
  editingId.value = null
  form.nameZh = ''
  form.nameEn = ''
  form.slug = ''
  error.value = ''
}

function create() {
  reset()
  panelOpen.value = true
}

function close() {
  panelOpen.value = false
  reset()
}

function edit(tag: AdminTag) {
  editingId.value = tag.id
  form.nameZh = tag.nameZh
  form.nameEn = tag.nameEn
  form.slug = tag.slug
  error.value = ''
  panelOpen.value = true
}

async function save() {
  saving.value = true
  error.value = ''

  try {
    const payload = { ...form }

    if (editingId.value) {
      await $fetch(`/api/admin/tags/${editingId.value}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/tags', { method: 'POST', body: payload })
    }

    await refresh()
    close()
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    error.value = message || '保存失败'
  } finally {
    saving.value = false
  }
}

async function remove(tag: AdminTag) {
  if (!window.confirm(`确定删除标签「${tag.nameZh}」？关联关系会一并移除。`)) {
    return
  }

  try {
    await $fetch(`/api/admin/tags/${tag.id}`, { method: 'DELETE' })
    await refresh()
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    error.value = message || '删除失败'
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="font-mono text-[10px] tracking-[0.24em] text-brand-500">TAXONOMY</p>
        <h1 class="mt-2 font-display text-4xl font-semibold tracking-tight">标签</h1>
      </div>

      <button
        type="button"
        class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500"
        @click="create"
      >
        新建标签
      </button>
    </div>

    <p v-if="error && !panelOpen" class="mt-4 border border-red-500/40 px-3 py-2 text-xs text-red-400">{{ error }}</p>

    <div v-if="data" class="mt-8 overflow-x-auto border border-paper/10">
      <table class="w-full min-w-[680px] text-left text-sm">
        <thead class="border-b border-paper/10 font-mono text-[10px] tracking-[0.18em] text-muted">
          <tr>
            <th class="px-4 py-3">NAME</th>
            <th class="px-4 py-3">SLUG</th>
            <th class="px-4 py-3">POSTS</th>
            <th class="px-4 py-3 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-paper/10">
          <tr v-for="tag in data.tags" :key="tag.id" class="transition hover:bg-paper/5">
            <td class="px-4 py-3">
              <p class="font-medium">#{{ tag.nameZh }}</p>
              <p class="font-mono text-[10px] text-muted">#{{ tag.nameEn }}</p>
            </td>
            <td class="px-4 py-3 font-mono text-xs text-muted">{{ tag.slug }}</td>
            <td class="px-4 py-3 font-mono text-xs text-muted">{{ tag.postCount }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-3 font-mono text-[10px]">
                <button class="text-muted transition hover:text-brand-500" @click="edit(tag)">编辑</button>
                <button class="text-muted transition hover:text-red-400" @click="remove(tag)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!data.tags.length">
            <td colspan="4" class="px-4 py-10 text-center text-sm text-muted">暂无标签。</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="panelOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8"
      @click.self="close"
    >
      <div class="w-full max-w-2xl border border-paper/15 bg-ink-950">
        <div class="flex items-center justify-between border-b border-paper/10 px-6 py-4">
          <h2 class="font-display text-xl font-semibold">{{ editingId ? '编辑标签' : '新建标签' }}</h2>
          <button type="button" class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper" @click="close">
            关闭
          </button>
        </div>

        <form class="grid gap-4 p-6 md:grid-cols-2" @submit.prevent="save">
          <label class="block">
            <span class="font-mono text-[10px] text-muted">名称（中文）</span>
            <input v-model="form.nameZh" type="text" required class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </label>
          <label class="block">
            <span class="font-mono text-[10px] text-muted">NAME (EN)</span>
            <input v-model="form.nameEn" type="text" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </label>
          <label class="block md:col-span-2">
            <span class="font-mono text-[10px] text-muted">SLUG（中英文共用）</span>
            <input v-model="form.slug" type="text" placeholder="留空自动生成" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-brand-500" />
          </label>

          <p v-if="error" class="border border-red-500/40 px-3 py-2 text-xs text-red-400 md:col-span-2">{{ error }}</p>

          <div class="flex items-center gap-3 md:col-span-2">
            <button
              type="submit"
              :disabled="saving"
              class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500 disabled:opacity-50"
            >
              {{ editingId ? '保存修改' : '创建标签' }}
            </button>
            <button type="button" class="border border-paper/15 px-5 py-2 font-mono text-[10px] text-muted transition hover:text-paper" @click="close">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
