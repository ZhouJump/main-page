<script setup lang="ts">
const props = defineProps<{
  page: number
  pageCount: number
  base: string
}>()

const items = computed<(number | 'gap')[]>(() => {
  if (props.pageCount <= 1) {
    return []
  }

  const pages = new Set<number>([1, props.pageCount, props.page, props.page - 1, props.page + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= props.pageCount).sort((a, b) => a - b)
  const result: (number | 'gap')[] = []
  let previous = 0

  for (const page of sorted) {
    if (previous && page - previous > 1) {
      result.push('gap')
    }

    result.push(page)
    previous = page
  }

  return result
})

function href(page: number) {
  return page === 1 ? props.base : `${props.base}page/${page}/`
}
</script>

<template>
  <nav v-if="pageCount > 1" class="blog-pagination" aria-label="分页">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="item === 'gap'" class="blog-pagination_gap">…</span>
      <NuxtLink
        v-else
        :to="href(item)"
        class="blog-pagination_link"
        :class="{ 'is-active': item === page }"
        :aria-current="item === page ? 'page' : undefined"
      >
        {{ item }}
      </NuxtLink>
    </template>
  </nav>
</template>
