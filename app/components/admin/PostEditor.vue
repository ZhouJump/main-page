<script setup lang="ts">
import type { AdminCategory, AdminPostDetail, AdminTag } from '~/types/admin'
import type { TocItem } from '~/types/blog'

const props = defineProps<{
  post?: AdminPostDetail | null
  categories: AdminCategory[]
  tags: AdminTag[]
}>()

const isNew = computed(() => !props.post)
const slugLocked = computed(() => Boolean(props.post?.published))

function toInput(iso: string): string {
  const date = new Date(iso)
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function autoSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}-]/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const form = reactive({
  slug: props.post?.slug ?? '',
  categoryId: props.post?.categoryId ?? props.categories[0]?.id ?? 0,
  tagIds: [...(props.post?.tagIds ?? [])],
  status: (props.post?.status ?? 'draft') as 'draft' | 'published',
  publishedAt: toInput(props.post?.publishedAt ?? new Date().toISOString())
})

const zh = reactive({
  id: props.post?.translations?.zh?.id ?? null,
  title: props.post?.translations?.zh?.title ?? '',
  excerpt: props.post?.translations?.zh?.excerpt ?? '',
  contentMd: props.post?.translations?.zh?.contentMd ?? ''
})

const en = reactive({
  id: props.post?.translations?.en?.id ?? null,
  title: props.post?.translations?.en?.title ?? '',
  excerpt: props.post?.translations?.en?.excerpt ?? '',
  contentMd: props.post?.translations?.en?.contentMd ?? ''
})

const activeLang = ref<'zh' | 'en'>('zh')
const current = computed(() => (activeLang.value === 'zh' ? zh : en))
const currentLabel = computed(() => (activeLang.value === 'zh' ? '中文' : 'ENGLISH'))

const textarea = ref<HTMLTextAreaElement>()
const fileInput = ref<HTMLInputElement>()
const hydrated = ref(false)
const dirty = ref(false)
const saving = ref(false)
const uploading = ref(false)
const savedAt = ref<string>('')
const error = ref('')
const previews = reactive<Record<'zh' | 'en', { html: string; toc: TocItem[] }>>({
  zh: { html: '', toc: [] },
  en: { html: '', toc: [] }
})
const slugTouched = ref(Boolean(props.post?.slug))

let autosaveTimer: ReturnType<typeof setTimeout> | null = null
const previewTimers: Record<'zh' | 'en', ReturnType<typeof setTimeout> | null> = { zh: null, en: null }

async function loadPreview(lang: 'zh' | 'en') {
  try {
    const result = await $fetch<{ html: string; toc: TocItem[] }>('/api/admin/preview', {
      method: 'POST',
      body: { contentMd: lang === 'zh' ? zh.contentMd : en.contentMd }
    })

    previews[lang].html = result.html
    previews[lang].toc = result.toc
  } catch {
    previews[lang].html = ''
  }
}

function schedulePreview(lang: 'zh' | 'en') {
  if (previewTimers[lang]) {
    clearTimeout(previewTimers[lang])
  }

  previewTimers[lang] = setTimeout(() => loadPreview(lang), 500)
}

async function save(silent = false) {
  if (saving.value) {
    return
  }

  if (!zh.title.trim() || !en.title.trim()) {
    error.value = '中文和英文标题都需要填写'
    return
  }

  saving.value = true
  error.value = ''

  try {
    const payload = {
      slug: form.slug,
      categoryId: form.categoryId,
      tagIds: form.tagIds,
      status: form.status,
      publishedAt: form.publishedAt,
      zh: { title: zh.title, excerpt: zh.excerpt, contentMd: zh.contentMd },
      en: { title: en.title, excerpt: en.excerpt, contentMd: en.contentMd }
    }

    if (isNew.value) {
      const result = await $fetch<{ id: number; ids: { zh: number; en: number } }>('/api/admin/posts/bilingual', {
        method: 'POST',
        body: payload
      })
      await navigateTo(`/admin/posts/${result.id}`)
      return
    }

    const result = await $fetch<{ ok: boolean; ids: { zh: number; en: number } }>(
      `/api/admin/posts/bilingual/${props.post!.id}`,
      { method: 'PUT', body: payload }
    )

    zh.id = result.ids.zh
    en.id = result.ids.en
    dirty.value = false
    savedAt.value = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    error.value = message || '保存失败'
    if (!silent) {
      dirty.value = true
    }
  } finally {
    saving.value = false
  }
}

function scheduleAutosave() {
  if (!props.post) {
    return
  }

  if (autosaveTimer) {
    clearTimeout(autosaveTimer)
  }

  autosaveTimer = setTimeout(() => {
    if (dirty.value) {
      save(true)
    }
  }, 2500)
}

watch([form, zh, en], () => {
  if (!hydrated.value) {
    return
  }

  dirty.value = true

  scheduleAutosave()
}, { deep: true })

watch(
  [() => zh.title, () => en.title],
  ([zhTitle, enTitle]) => {
    if (!slugTouched.value) {
      form.slug = autoSlug(zhTitle || enTitle)
    }
  }
)

watch(() => zh.contentMd, () => schedulePreview('zh'))
watch(() => en.contentMd, () => schedulePreview('en'))

watch(activeLang, (lang) => {
  if (!previews[lang].html) {
    loadPreview(lang)
  }
})

function insert(before: string, after = '', placeholder = '') {
  const element = textarea.value

  if (!element) {
    return
  }

  const start = element.selectionStart
  const end = element.selectionEnd
  const selected = current.value.contentMd.slice(start, end) || placeholder

  current.value.contentMd = `${current.value.contentMd.slice(0, start)}${before}${selected}${after}${current.value.contentMd.slice(end)}`

  nextTick(() => {
    element.focus()
    element.selectionStart = start + before.length
    element.selectionEnd = start + before.length + selected.length
  })
}

function prefixLine(prefix: string) {
  const element = textarea.value

  if (!element) {
    return
  }

  const start = current.value.contentMd.lastIndexOf('\n', element.selectionStart - 1) + 1
  current.value.contentMd = `${current.value.contentMd.slice(0, start)}${prefix}${current.value.contentMd.slice(start)}`

  nextTick(() => {
    element.focus()
    element.selectionStart = start + prefix.length
  })
}

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const data = new FormData()
    data.append('file', file)
    const result = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: data })
    insert(`\n![](${result.path})\n`)
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    error.value = message || '图片上传失败'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

onMounted(async () => {
  await nextTick()
  hydrated.value = true
  loadPreview('zh')
  loadPreview('en')
})
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="font-mono text-[10px] tracking-[0.24em] text-brand-500">{{ isNew ? 'NEW POST' : 'EDIT POST' }}</p>
        <h1 class="mt-2 font-display text-3xl font-semibold tracking-tight lg:text-4xl">
          {{ current.title || (isNew ? '写新文章' : '未命名') }}
        </h1>
        <p class="mt-2 font-mono text-[10px] text-muted">正在编辑：{{ currentLabel }}</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="font-mono text-[10px] text-muted">
          <template v-if="saving">保存中…</template>
          <template v-else-if="dirty">未保存</template>
          <template v-else-if="savedAt">已保存 {{ savedAt }}</template>
        </span>
        <a
          v-if="!isNew && form.slug"
          :href="`/blog/p/${form.slug}/`"
          target="_blank"
          class="font-mono text-[10px] text-muted transition hover:text-paper"
        >
          中文预览
        </a>
        <a
          v-if="!isNew && form.slug"
          :href="`/en/blog/p/${form.slug}/`"
          target="_blank"
          class="font-mono text-[10px] text-muted transition hover:text-paper"
        >
          EN 预览
        </a>
        <button
          class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500 disabled:opacity-50"
          :disabled="saving"
          @click="save()"
        >
          {{ isNew ? '创建文章' : '保存' }}
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-4 border border-red-500/40 px-3 py-2 text-xs text-red-400">{{ error }}</p>

    <div class="mt-8 grid gap-3 border border-paper/10 p-4 md:grid-cols-2 xl:grid-cols-4">
      <label class="block">
        <span class="font-mono text-[10px] text-muted">SLUG</span>
        <input
          v-model="form.slug"
          type="text"
          class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-brand-500 disabled:opacity-50"
          :disabled="slugLocked"
          @input="slugTouched = true"
        />
      </label>

      <label class="block">
        <span class="font-mono text-[10px] text-muted">CATEGORY</span>
        <select v-model.number="form.categoryId" class="mt-1 w-full border border-paper/15 bg-ink-950 px-3 py-2 text-sm outline-none focus:border-brand-500">
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.nameZh }}</option>
        </select>
      </label>

      <label class="block">
        <span class="font-mono text-[10px] text-muted">STATUS</span>
        <select v-model="form.status" class="mt-1 w-full border border-paper/15 bg-ink-950 px-3 py-2 text-sm outline-none focus:border-brand-500">
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
        </select>
      </label>

      <label class="block">
        <span class="font-mono text-[10px] text-muted">PUBLISHED AT</span>
        <input v-model="form.publishedAt" type="datetime-local" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
      </label>
    </div>

    <div class="mt-3 flex flex-wrap gap-2 border border-paper/10 p-4">
      <label
        v-for="tag in tags"
        :key="tag.id"
        class="flex cursor-pointer items-center gap-2 border px-2.5 py-1 font-mono text-[10px] transition"
        :class="form.tagIds.includes(tag.id) ? 'border-brand-500 text-brand-500' : 'border-paper/15 text-muted'"
      >
        <input v-model="form.tagIds" type="checkbox" :value="tag.id" class="hidden" />
        #{{ tag.nameZh }}
      </label>
    </div>

    <div class="mt-6 flex items-center gap-2 border-b border-paper/10">
      <button
        v-for="lang in (['zh', 'en'] as const)"
        :key="lang"
        type="button"
        class="px-4 py-2 font-mono text-[10px] tracking-[0.18em] transition"
        :class="activeLang === lang ? 'border-b-2 border-brand-500 text-paper' : 'text-muted hover:text-paper'"
        @click="activeLang = lang"
      >
        {{ lang === 'zh' ? '中文' : 'ENGLISH' }}
      </button>
    </div>

    <div class="mt-3 grid gap-3 border border-paper/10 p-4 md:grid-cols-2">
      <label class="block">
        <span class="font-mono text-[10px] text-muted">TITLE · {{ currentLabel }}</span>
        <input v-model="current.title" type="text" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
      </label>

      <label class="block">
        <span class="font-mono text-[10px] text-muted">EXCERPT · {{ currentLabel }}</span>
        <input v-model="current.excerpt" type="text" class="mt-1 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500" />
      </label>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-2 border border-paper/10 border-b-0 px-3 py-2">
      <button type="button" class="toolbar" @click="insert('**', '**', '加粗')">B</button>
      <button type="button" class="toolbar italic" @click="insert('*', '*', '斜体')">I</button>
      <button type="button" class="toolbar" @click="prefixLine('## ')">H2</button>
      <button type="button" class="toolbar" @click="prefixLine('### ')">H3</button>
      <button type="button" class="toolbar" @click="prefixLine('> ')">QUOTE</button>
      <button type="button" class="toolbar" @click="prefixLine('- ')">LIST</button>
      <button type="button" class="toolbar" @click="insert('`', '`', 'code')">CODE</button>
      <button type="button" class="toolbar" @click="insert('[', '](https://)', '链接文字')">LINK</button>
      <span class="mx-1 h-4 w-px bg-paper/15" />
      <button type="button" class="toolbar" :disabled="uploading" @click="fileInput?.click()">
        {{ uploading ? 'UPLOADING…' : 'IMAGE' }}
      </button>
      <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" class="hidden" @change="uploadImage" />
      <span class="ml-auto font-mono text-[10px] text-muted">{{ current.contentMd.length }} CHARS</span>
    </div>

    <div class="grid border border-paper/10 lg:grid-cols-2">
      <textarea
        ref="textarea"
        v-model="current.contentMd"
        spellcheck="false"
        class="min-h-[560px] w-full resize-y bg-transparent p-4 font-mono text-xs leading-6 outline-none"
        :placeholder="`在此撰写 ${currentLabel} Markdown…`"
      />

      <div class="min-h-[560px] border-t border-paper/10 p-5 lg:border-t-0 lg:border-l">
        <div v-if="previews[activeLang].toc.length" class="mb-5 border-b border-paper/10 pb-4">
          <p class="font-mono text-[10px] tracking-[0.2em] text-muted">TOC</p>
          <p v-for="item in previews[activeLang].toc" :key="item.id" class="mt-1 text-xs text-muted" :class="item.level === 3 ? 'pl-3' : ''">
            {{ item.text }}
          </p>
        </div>
        <div v-if="previews[activeLang].html" class="article-body" v-html="previews[activeLang].html" />
        <p v-else class="text-sm text-muted">预览区域。开始输入后自动渲染。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  border: 1px solid color-mix(in srgb, var(--color-paper) 15%, transparent);
  padding: 0.2rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  transition: color 0.15s, border-color 0.15s;
}

.toolbar:hover:not(:disabled) {
  color: var(--color-paper);
  border-color: var(--color-brand-500);
}

.toolbar:disabled {
  opacity: 0.5;
}
</style>
