<script setup lang="ts">
const route = useRoute()
const isEn = computed(() => route.path === '/en/blog' || route.path.startsWith('/en/blog/'))
const prefix = computed(() => (isEn.value ? '/en/blog' : '/blog'))

const items = computed(() => {
  const labels = isEn.value
    ? ['All posts', 'Categories', 'Tags', 'Archive', 'Search']
    : ['全部文章', '分类', '标签', '归档', '搜索']

  return [
    { label: labels[0], to: `${prefix.value}/` },
    { label: labels[1], to: `${prefix.value}/categories/` },
    { label: labels[2], to: `${prefix.value}/tags/` },
    { label: labels[3], to: `${prefix.value}/archives/` },
    { label: labels[4], to: `${prefix.value}/search/` }
  ]
})
</script>

<template>
  <aside class="blog-sidebar">
    <div>
      <p class="blog-sidebar_title">JOURNAL</p>
      <nav class="blog-sidebar_nav">
        <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="blog-sidebar_link">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>

    <div class="blog-sidebar_footer">
      <div class="blog-sidebar_divider" />
      <a :href="`${prefix}/index.xml`" class="blog-sidebar_link">RSS</a>
      <NuxtLink to="/admin" class="blog-sidebar_link">{{ isEn ? 'ADMIN' : '后台' }}</NuxtLink>
    </div>
  </aside>
</template>
