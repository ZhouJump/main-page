<script setup>
import Hero from './comp/hero.vue'
import { useData } from 'vitepress'
const { site, frontmatter } = useData()
</script>
<template>
  <div class="home">
    111
    <hero :desc="frontmatter.desc" :desc2="frontmatter.desc2" :page="frontmatter.page"></hero>
  </div>
</template>
<style scoped>
.home{
    position: relative;
}
</style>
<style>
@keyframes flip {
    0% {
        transform: rotate3d(0, 1, 0, 180deg);
    }
    100% {
        transform: rotate3d(0, 1, 0, 0deg);
    }
}
</style>