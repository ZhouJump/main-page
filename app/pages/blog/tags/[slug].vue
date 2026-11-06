<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug ?? '')
</script>

<template>
  <BlogListPage lang="zh" kind="tag" :slug="slug" :page="1" />
</template>
