<script setup lang="ts">
import type { AdminCategory, AdminPostDetail, AdminTag } from '~/types/admin'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const [{ data: post, error }, { data: categoryData }, { data: tagData }] = await Promise.all([
  useFetch<AdminPostDetail>(`/api/admin/posts/${id}`),
  useFetch<{ categories: AdminCategory[] }>('/api/admin/categories'),
  useFetch<{ tags: AdminTag[] }>('/api/admin/tags')
])

if (error.value || !post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}
</script>

<template>
  <AdminPostEditor
    v-if="post"
    :post="post"
    :categories="categoryData?.categories ?? []"
    :tags="tagData?.tags ?? []"
  />
</template>
