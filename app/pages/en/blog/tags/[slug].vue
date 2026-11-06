<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug ?? '')
</script>

<template>
  <BlogListPage lang="en" kind="tag" :slug="slug" :page="1" />
</template>
