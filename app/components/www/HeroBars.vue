<script setup lang="ts">
import { initHeroBars } from './barsScene'

const { isEn } = useLang()

const root = ref<HTMLElement | null>(null)
let stop: (() => void) | null = null

// the bars scene starts only after the first-paint loader has fully left
useAfterLoader(() => {
  if (root.value) stop = initHeroBars(root.value)
})

onBeforeUnmount(() => {
  stop?.()
  stop = null
})
</script>

<template>
  <section ref="root" class="bh-hero">
    <div class="padding-global less-padding z-index-2">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-vflex bh-hero_layout">
          <h1 class="h1-90px color-off-white text-center mob_40px">
            <span class="hero-line-mask"><span data-hero-line>{{ isEn ? 'Six projects,' : '六个项目，' }}</span></span>
            <span class="hero-line-mask"><span data-hero-line>{{ isEn ? 'six kinds of problems.' : '六种问题。' }}</span></span>
          </h1>
        </div>
      </div>
    </div>

    <div class="home-hero_canvas w-embed">
      <div data-bars>
        <canvas data-bars-canvas />
      </div>
    </div>
  </section>
</template>

<style scoped>
[data-bars] {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}
[data-bars] canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
