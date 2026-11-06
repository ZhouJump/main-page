<script setup lang="ts">
const route = useRoute()
const { isBlog, baseURL } = useSite()

const canonical = computed(() => {
  const path = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
  const normalized = isBlog.value ? `${path}/` : path

  return `${baseURL.value.replace(/\/$/, '')}${normalized === '/' ? '/' : normalized}`
})

useHead({
  link: computed(() => [{ rel: 'canonical', href: canonical.value }])
})
</script>

<template>
  <UApp>
    <SiteLoader />
    <RouteCurtain />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
