<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const { isBlog } = useSite()

const title = computed(() => (props.error.statusCode === 404 ? '页面不存在' : '页面出了点问题'))
const description = computed(() => {
  if (props.error.statusCode === 404) {
    return isBlog.value
      ? '这篇文章可能已被移动或删除，试试从首页或搜索重新找到它。'
      : '这个页面可能已被移动或删除，回到首页继续浏览。'
  }

  return '服务暂时不可用，请稍后再试。'
})
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col justify-center bg-ink-950 text-paper">
      <div class="www-container">
        <p class="font-mono text-[10px] tracking-[0.3em] text-brand-500">ERROR / {{ error.statusCode }}</p>
        <h1 class="mt-6 font-display text-5xl leading-[0.95] font-semibold tracking-tight md:text-8xl">
          {{ title }}
        </h1>
        <p class="mt-6 max-w-xl text-sm leading-7 text-muted">{{ description }}</p>

        <div class="mt-10 flex flex-wrap gap-3">
          <UButton color="primary" size="lg" @click="clearError({ redirect: '/' })">返回首页</UButton>
          <UButton
            v-if="isBlog"
            color="neutral"
            variant="outline"
            size="lg"
            @click="clearError({ redirect: '/search/' })"
          >
            去搜索
          </UButton>
          <UButton
            v-else
            color="neutral"
            variant="outline"
            size="lg"
            @click="clearError({ redirect: '/project' })"
          >
            查看项目
          </UButton>
        </div>
      </div>
    </div>
  </UApp>
</template>
