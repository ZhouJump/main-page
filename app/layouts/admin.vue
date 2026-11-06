<script setup lang="ts">
import { RiDashboardLine, RiFileTextLine, RiFolderLine, RiPriceTag3Line, RiChat3Line } from '@remixicon/vue'

const { clear } = useUserSession()
const { data: me } = await useFetch<{ user: { id: number; username: string } | null }>('/api/admin/me')

const nav = [
  { label: '概览', to: '/admin', icon: RiDashboardLine },
  { label: '文章', to: '/admin/posts', icon: RiFileTextLine },
  { label: '分类', to: '/admin/categories', icon: RiFolderLine },
  { label: '标签', to: '/admin/tags', icon: RiPriceTag3Line },
  { label: '评论', to: '/admin/comments', icon: RiChat3Line }
]

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await clear()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen w-full bg-ink-950 text-paper">
    <div class="flex min-h-screen w-full flex-col lg:flex-row">
      <aside class="border-b border-paper/10 px-6 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-8 lg:py-10">
        <NuxtLink to="/admin" class="font-display text-xl font-semibold tracking-tight">
          ZHOUJUMP<span class="text-brand-500">.</span>
        </NuxtLink>
        <p class="mt-1 font-mono text-[10px] tracking-[0.2em] text-muted">CMS</p>

        <nav class="mt-8 flex flex-wrap gap-1 lg:flex-col">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 border border-transparent px-3 py-2 text-sm text-muted transition hover:text-paper"
            active-class="!border-paper/15 !text-paper"
          >
            <component :is="item.icon" class="text-base" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="mt-8 border-t border-paper/10 pt-5">
          <p class="font-mono text-[10px] text-muted">{{ me?.user?.username }}</p>
          <button class="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-brand-500" @click="logout">
            LOGOUT
          </button>
        </div>
      </aside>

      <main class="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12 xl:px-16">
        <slot />
      </main>
    </div>
  </div>
</template>
