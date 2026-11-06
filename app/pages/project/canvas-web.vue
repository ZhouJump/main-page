<script setup lang="ts">
import { canvasWeb } from '~/data/projectDetails'

const { isEn } = useLang()
const content = computed(() => (isEn.value ? canvasWeb.en : canvasWeb.zh))

useSeoMeta({
  title: () => (isEn.value ? 'Canvas Web · Cloud AI Workflows' : 'Canvas Web · 云端 AI 工作流'),
  description: () => (isEn.value ? content.value.project.en.summary : content.value.project.summary)
})
</script>

<template>
  <WwwProjectDetail :content="content" />
</template>
