<script setup lang="ts">
const route = useRoute()
const parsed = Number.parseInt(String(route.params.n), 10)

if (!Number.isFinite(parsed) || parsed < 1) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <BlogHome lang="en" :page="parsed" />
</template>
