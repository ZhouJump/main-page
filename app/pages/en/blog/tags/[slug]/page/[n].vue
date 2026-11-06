<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug ?? '')
const parsed = Number.parseInt(String(route.params.n), 10)

if (!Number.isFinite(parsed) || parsed < 1) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <BlogListPage lang="en" kind="tag" :slug="slug" :page="parsed" />
</template>
