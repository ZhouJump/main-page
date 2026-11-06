<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug ?? '')
</script>

<template>
  <BlogPost lang="zh" :slug="slug" />
</template>
