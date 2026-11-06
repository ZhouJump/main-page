<script setup lang="ts">
import type { AdminCategory } from '~/types/admin'

definePageMeta({ layout: 'admin' })

const { data, refresh } = await useFetch<{ categories: AdminCategory[] }>('/api/admin/categories')

const panelOpen = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const uploading = ref(false)
const error = ref('')

const form = reactive({
  slug: '',
  nameZh: '',
  nameEn: '',
  descZh: '',
  descEn: '',
  imagePath: '' as string | null,
  titleColor: '#EFEFEB'
})

function reset() {
  editingId.value = null
  form.slug = ''
  form.nameZh = ''
  form.nameEn = ''
  form.descZh = ''
  form.descEn = ''
  form.imagePath = ''
  form.titleColor = '#EFEFEB'
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

function edit(category: AdminCategory) {
  editingId.value = category.id
  form.slug = category.slug
  form.nameZh = category.nameZh
  form.nameEn = category.nameEn
  form.descZh = category.descZh
  form.descEn = category.descEn
  form.imagePath = category.imagePath ?? ''
  form.titleColor = category.titleColor
  error.value = ''
  panelOpen.value = true
}

async function save() {
  saving.value = true
  error.value = ''

  try {
    const payload = {
      slug: form.slug,
      nameZh: form.nameZh,
      nameEn: form.nameEn,
      descZh: form.descZh,
      descEn: form.descEn,
      imagePath: form.imagePath || null,
      titleColor: form.titleColor
    }

    if (editingId.value) {
      await $fetch(`/api/admin/categories/${editingId.value}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/categories', { method: 'POST', body: payload })
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

async function uploadCover(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const body = new FormData()
    body.append('file', file)
    const result = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body })
    form.imagePath = result.path
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    error.value = message || '封面上传失败'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function remove(category: AdminCategory) {
  if (!window.confirm(`确定删除分类「${category.nameZh}」？`)) {
    return
  }

  try {
    await $fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
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
        <h1 class="mt-2 font-display text-4xl font-semibold tracking-tight">分类</h1>
      </div>

      <button
        type="button"
        class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500"
        @click="create"
      >
        新建分类
      </button>
    </div>

    <p v-if="error && !panelOpen" class="mt-4 border border-red-500/40 px-3 py-2 text-xs text-red-400">{{ error }}</p>

    <div v-if="data" class="mt-8 overflow-x-auto border border-paper/10">
      <table class="w-full min-w-[680px] text-left text-sm">
        <thead class="border-b border-paper/10 font-mono text-[10px] tracking-[0.18em] text-muted">
          <tr>
            <th class="px-4 py-3">COVER</th>
            <th class="px-4 py-3">NAME</th>
            <th class="px-4 py-3">SLUG</th>
            <th class="px-4 py-3">POSTS</th>
            <th class="px-4 py-3 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-paper/10">
          <tr v-for="category in data.categories" :key="category.id" class="transition hover:bg-paper/5">
            <td class="px-4 py-3">
              <img v-if="category.imagePath" :src="category.imagePath" alt="" class="h-9 w-14 border border-paper/15 object-cover" />
              <div v-else class="h-9 w-14 border border-paper/15" :style="{ backgroundColor: category.titleColor }" />
            </td>
            <td class="px-4 py-3">
              <p class="font-medium">{{ category.nameZh }}</p>
              <p class="font-mono text-[10px] text-muted">{{ category.nameEn }}</p>
            </td>
            <td class="px-4 py-3 font-mono text-xs text-muted">{{ category.slug }}</td>
            <td class="px-4 py-3 font-mono text-xs text-muted">{{ category.postCount }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-3 font-mono text-[10px]">
                <button class="text-muted transition hover:text-brand-500" @click="edit(category)">编辑</button>
                <button class="text-muted transition hover:text-red-400" @click="remove(category)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!data.categories.length">
            <td colspan="5" class="px-4 py-10 text-center text-sm text-muted">暂无分类。</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="panelOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8"
      @click.self="close"
    >
      <div class="w-full max-w-4xl border border-paper/15 bg-ink-950">
        <div class="flex items-center justify-between border-b border-paper/10 px-6 py-4">
          <h2 class="font-display text-xl font-semibold">{{ editingId ? '编辑分类' : '新建分类' }}</h2>
          <button type="button" class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper" @click="close">
            关闭
          </button>
        </div>

        <form class="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3" @submit.prevent="save">
          <label class="block">
            <span class="font-mono text-[10px] text-muted">SLUG</span>
            <input v-model="form.slug" type="text" placeholder="technology" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-brand-500" />
          </label>

          <label class="block">
            <span class="font-mono text-[10px] text-muted">名称（中文）</span>
            <input v-model="form.nameZh" type="text" required class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </label>

          <label class="block">
            <span class="font-mono text-[10px] text-muted">NAME (EN)</span>
            <input v-model="form.nameEn" type="text" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </label>

          <label class="block">
            <span class="font-mono text-[10px] text-muted">描述（中文）</span>
            <input v-model="form.descZh" type="text" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </label>

          <label class="block">
            <span class="font-mono text-[10px] text-muted">DESCRIPTION (EN)</span>
            <input v-model="form.descEn" type="text" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
          </label>

          <label class="block">
            <span class="font-mono text-[10px] text-muted">标题颜色（列表无封面时作底色）</span>
            <div class="mt-1 flex items-center gap-2">
              <input v-model="form.titleColor" type="color" class="h-9 w-10 border border-paper/15 bg-transparent" />
              <input v-model="form.titleColor" type="text" class="w-full border border-paper/15 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-brand-500" />
            </div>
          </label>

          <div class="block">
            <span class="font-mono text-[10px] text-muted">COVER</span>
            <div class="mt-1 flex items-center gap-3">
              <img v-if="form.imagePath" :src="form.imagePath" alt="封面预览" class="h-12 w-20 border border-paper/15 object-cover" />
              <label class="cursor-pointer border border-paper/15 px-3 py-2 font-mono text-[10px] text-muted transition hover:text-paper">
                {{ uploading ? 'UPLOADING…' : form.imagePath ? '更换封面' : '上传封面' }}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" class="hidden" @change="uploadCover" />
              </label>
              <button v-if="form.imagePath" type="button" class="font-mono text-[10px] text-muted hover:text-red-400" @click="form.imagePath = ''">
                移除
              </button>
            </div>
          </div>

          <p v-if="error" class="border border-red-500/40 px-3 py-2 text-xs text-red-400 md:col-span-2 xl:col-span-3">{{ error }}</p>

          <div class="flex items-center gap-3 md:col-span-2 xl:col-span-3">
            <button
              type="submit"
              :disabled="saving"
              class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500 disabled:opacity-50"
            >
              {{ editingId ? '保存修改' : '创建分类' }}
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
