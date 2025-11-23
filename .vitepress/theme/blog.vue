<script setup>
import Hero from './comp/hero.vue'
import { useData } from 'vitepress'
const { site, frontmatter } = useData()
</script>
<template>
    <div class="project">
        <hero :desc="frontmatter.desc" :desc2="frontmatter.desc2" :page="frontmatter.page"></hero>
    </div>
</template>
<style scoped>
.project{
    position: relative;
}
</style>
