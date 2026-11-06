<script setup lang="ts">
import { noteflow } from '~/data/projectDetails'

const { isEn } = useLang()
const content = computed(() => (isEn.value ? noteflow.en : noteflow.zh))

useSeoMeta({
  title: () => (isEn.value ? 'NoteFlow · Score Annotation & Export' : 'NoteFlow · 乐谱标注与导出'),
  description: () => (isEn.value ? content.value.project.en.summary : content.value.project.summary)
})
</script>

<template>
  <WwwProjectDetail :content="content" />
</template>
