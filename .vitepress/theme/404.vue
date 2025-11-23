<script setup>
import Hero from './comp/hero.vue'
import { useData } from 'vitepress'
const { site, frontmatter } = useData()
</script>
<template>
    <div class="project">
        <hero desc="0000访问的页面不存在哦0000" :page="frontmatter.page"></hero>
    </div>
</template>
<style scoped>
.project{
    position: relative;
}
</style>
