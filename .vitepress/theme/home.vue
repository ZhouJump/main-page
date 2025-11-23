<script setup>
import { useData } from 'vitepress'
const { site, frontmatter } = useData()
</script>
<template>
  <div class="home">
  </div>
</template>
<style scoped>
.home{
    position: relative;
    cursor: default;
    width: 100%;
    height: 100%;
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