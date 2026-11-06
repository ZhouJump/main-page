<script setup lang="ts">
definePageMeta({ layout: false })

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })

    await navigateTo('/admin')
  } catch (err) {
    const message = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    error.value = message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-ink-950 px-6">
    <form class="w-full max-w-sm border border-paper/10 p-8" @submit.prevent="submit">
      <p class="font-mono text-[10px] tracking-[0.24em] text-brand-500">CMS / LOGIN</p>
      <h1 class="mt-3 font-display text-3xl font-semibold tracking-tight">管理员登录</h1>

      <label class="mt-8 block">
        <span class="font-mono text-[10px] text-muted">USERNAME</span>
        <input
          v-model="username"
          type="text"
          autocomplete="username"
          required
          class="mt-1.5 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-brand-500"
        />
      </label>

      <label class="mt-4 block">
        <span class="font-mono text-[10px] text-muted">PASSWORD</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="mt-1.5 w-full border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-brand-500"
        />
      </label>

      <p v-if="error" class="mt-4 text-xs text-red-400">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="mt-6 w-full border border-brand-500 bg-brand-500 px-5 py-2.5 font-mono text-[10px] tracking-[0.18em] text-black transition hover:bg-transparent hover:text-brand-500 disabled:opacity-50"
      >
        {{ loading ? 'SIGNING IN…' : 'SIGN IN' }}
      </button>
    </form>
  </div>
</template>
