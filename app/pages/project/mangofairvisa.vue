<script setup lang="ts">
import { mangofairvisa } from '~/data/projectDetails'

const { isEn } = useLang()
const content = computed(() => (isEn.value ? mangofairvisa.en : mangofairvisa.zh))

useSeoMeta({
  title: () => (isEn.value ? 'Mango Fair Visa · Expo Pre-registration' : '芒果表单 · Mango Fair Visa'),
  description: () => (isEn.value ? content.value.project.en.summary : content.value.project.summary)
})
</script>

<template>
  <WwwProjectDetail :content="content" />
</template>
