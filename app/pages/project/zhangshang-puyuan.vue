<script setup lang="ts">
import { zhangshangPuyuan } from '~/data/projectDetails'

const { isEn } = useLang()
const content = computed(() => (isEn.value ? zhangshangPuyuan.en : zhangshangPuyuan.zh))

useSeoMeta({
  title: () => (isEn.value ? 'Zhangshang Puyuan · Campus Mobile' : '掌上莆院 · 校园移动端'),
  description: () => (isEn.value ? content.value.project.en.summary : content.value.project.summary)
})
</script>

<template>
  <WwwProjectDetail :content="content" />
</template>
