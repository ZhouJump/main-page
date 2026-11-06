<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug ?? '')
</script>

<template>
  <BlogPost lang="en" :slug="slug" />
</template>
