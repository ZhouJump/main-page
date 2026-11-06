<script setup lang="ts">
import type { AdminCategory, AdminTag } from '~/types/admin'

definePageMeta({ layout: 'admin' })

const [{ data: categoryData }, { data: tagData }] = await Promise.all([
  useFetch<{ categories: AdminCategory[] }>('/api/admin/categories'),
  useFetch<{ tags: AdminTag[] }>('/api/admin/tags')
])
</script>

<template>
  <AdminPostEditor
    :categories="categoryData?.categories ?? []"
    :tags="tagData?.tags ?? []"
  />
</template>
