<script setup lang="ts">
import { starify } from '~/data/projectDetails'

const { isEn } = useLang()
const content = computed(() => (isEn.value ? starify.en : starify.zh))

useSeoMeta({
  title: () => (isEn.value ? 'Starify · Cross-border Marketing App' : '星光跨境营销 · Starify'),
  description: () => (isEn.value ? content.value.project.en.summary : content.value.project.summary)
})
</script>

<template>
  <WwwProjectDetail :content="content" />
</template>
