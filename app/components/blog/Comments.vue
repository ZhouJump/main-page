<script setup lang="ts">
import type { CommentsResponse } from '~/types/blog'

const props = defineProps<{
  lang: 'zh' | 'en'
  slug: string
}>()

const config = useRuntimeConfig()
const siteKey = config.public.turnstileSiteKey

const { data, refresh } = await useFetch<CommentsResponse>('/api/comments', {
  query: { lang: props.lang, slug: props.slug },
  default: () => ({ total: 0, comments: [] })
})

const nickname = ref('')
const email = ref('')
const content = ref('')
const honeypot = ref('')
const startedAt = ref(new Date().toISOString())
const token = ref('')
const submitting = ref(false)
const feedback = ref('')
const failed = ref(false)

const widget = ref<HTMLElement>()
let widgetId: string | null = null

useHead({
  script: siteKey
    ? [{ src: 'https://challenges.cloudflare.com/turnstile/v0/api.js', async: true, defer: true }]
    : []
})

function waitForTurnstile(): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(timer)
        resolve()
      }
    }, 200)

    window.setTimeout(() => {
      window.clearInterval(timer)
      resolve()
    }, 8000)
  })
}

onMounted(async () => {
  if (!siteKey || !widget.value) {
    return
  }

  await waitForTurnstile()

  if (!window.turnstile) {
    return
  }

  widgetId = window.turnstile.render(widget.value, {
    sitekey: siteKey,
    theme: 'dark',
    callback: (value) => {
      token.value = value
    },
    'expired-callback': () => {
      token.value = ''
    },
    'error-callback': () => {
      token.value = ''
    }
  })
})

async function submit() {
  feedback.value = ''
  failed.value = false

  if (!token.value && siteKey) {
    failed.value = true
    feedback.value = props.lang === 'en' ? 'Please complete the verification.' : '请先完成人机验证。'
    return
  }

  submitting.value = true

  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        lang: props.lang,
        slug: props.slug,
        nickname: nickname.value,
        email: email.value,
        content: content.value,
        honeypot: honeypot.value,
        startedAt: startedAt.value,
        token: token.value
      }
    })

    content.value = ''
    token.value = ''
    startedAt.value = new Date().toISOString()
    feedback.value = props.lang === 'en' ? 'Comment posted.' : '评论已发布。'

    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId)
    }

    await refresh()
  } catch (error) {
    const message = (error as { data?: { statusMessage?: string } })?.data?.statusMessage
    failed.value = true
    feedback.value = message || (props.lang === 'en' ? 'Failed to post comment.' : '评论提交失败，请稍后再试。')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="mt-16 border-t border-paper/10 pt-10">
    <div class="flex items-baseline justify-between">
      <h2 class="font-mono text-[10px] tracking-[0.24em] text-muted">COMMENTS</h2>
      <span class="font-mono text-[10px] tracking-[0.18em] text-muted">{{ data.total }}</span>
    </div>

    <ul v-if="data.comments.length" class="mt-6 space-y-6">
      <li v-for="comment in data.comments" :key="comment.id" class="flex gap-4">
        <img
          v-if="comment.avatar"
          :src="comment.avatar"
          :alt="comment.nickname"
          width="40"
          height="40"
          loading="lazy"
          class="h-10 w-10 shrink-0 rounded-full border border-paper/10"
        />
        <div
          v-else
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/10 font-display text-sm"
        >
          {{ comment.nickname.slice(0, 1).toUpperCase() }}
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span class="text-sm font-medium text-paper">{{ comment.nickname }}</span>
            <time :datetime="comment.createdAt" class="font-mono text-[10px] text-muted">
              {{ formatDate(comment.createdAt, lang) }}
            </time>
          </div>
          <div class="mt-2 text-sm leading-7 break-words text-muted [&_a]:text-brand-500 [&_a]:underline" v-html="comment.html" />
        </div>
      </li>
    </ul>

    <p v-else class="mt-6 text-sm text-muted">{{ lang === 'en' ? 'No comments yet. Be the first.' : '还没有评论，来抢沙发。' }}</p>

    <form class="mt-10 border border-paper/10 p-5 lg:p-6" @submit.prevent="submit">
      <p class="font-mono text-[10px] tracking-[0.24em] text-muted">{{ lang === 'en' ? 'LEAVE A COMMENT' : '发表评论' }}</p>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <label class="block">
          <span class="font-mono text-[10px] text-muted">{{ lang === 'en' ? 'NICKNAME' : '昵称' }}</span>
          <input
            v-model="nickname"
            type="text"
            maxlength="30"
            required
            class="mt-1.5 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm text-paper outline-none transition focus:border-brand-500"
          />
        </label>
        <label class="block">
          <span class="font-mono text-[10px] text-muted">{{ lang === 'en' ? 'EMAIL (OPTIONAL)' : '邮箱（可选）' }}</span>
          <input
            v-model="email"
            type="email"
            maxlength="120"
            class="mt-1.5 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm text-paper outline-none transition focus:border-brand-500"
          />
        </label>
      </div>

      <label class="mt-3 block">
        <span class="font-mono text-[10px] text-muted">{{ lang === 'en' ? 'CONTENT' : '内容' }}</span>
        <textarea
          v-model="content"
          rows="5"
          maxlength="2000"
          required
          class="mt-1.5 w-full resize-y border border-paper/15 bg-transparent px-3 py-2 text-sm leading-6 text-paper outline-none transition focus:border-brand-500"
        />
      </label>

      <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

      <div ref="widget" class="mt-4" />

      <div class="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          :disabled="submitting"
          class="border border-brand-500 bg-brand-500 px-5 py-2 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500 disabled:opacity-50"
        >
          {{ submitting ? (lang === 'en' ? 'POSTING...' : '提交中…') : lang === 'en' ? 'POST COMMENT' : '提交评论' }}
        </button>
        <p v-if="feedback" class="text-xs" :class="failed ? 'text-red-400' : 'text-brand-500'">{{ feedback }}</p>
      </div>

      <p class="mt-4 text-[11px] leading-5 text-muted">
        {{
          lang === 'en'
            ? 'Comments are public immediately. Email is only used for your Gravatar avatar.'
            : '评论提交后立即可见。邮箱仅用于生成 Gravatar 头像，不会公开显示。'
        }}
      </p>
    </form>
  </section>
</template>
