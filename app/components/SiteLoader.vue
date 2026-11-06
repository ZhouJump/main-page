<script setup lang="ts">
// rendered in SSR so the curtain is already on screen during the first paint
const visible = ref(true)
const progress = ref(0)
const leaving = ref(false)

function finish() {
  ;(window as unknown as { __zjLoaderDone?: boolean }).__zjLoaderDone = true
  visible.value = false
  window.dispatchEvent(new CustomEvent('zj:loader-done'))
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish()
    return
  }

  const startedAt = performance.now()
  const duration = 1200
  let done = false
  let hardStop = 0

  const leave = () => {
    if (done) {
      return
    }

    done = true
    window.clearTimeout(hardStop)
    leaving.value = true
    // grey panel 500ms, brand layer starts 180ms in and needs another 500ms
    window.setTimeout(finish, 760)
  }

  // requestAnimationFrame is paused in background tabs: never leave the curtain stuck
  hardStop = window.setTimeout(leave, 2600)

  const tick = (now: number) => {
    const ratio = Math.min(1, (now - startedAt) / duration)
    progress.value = Math.round(ratio * 100)

    if (ratio < 1) {
      requestAnimationFrame(tick)
      return
    }

    window.setTimeout(leave, 80)
  }

  requestAnimationFrame(tick)
})
</script>

<template>
  <div v-if="visible" class="site-loader" :class="{ 'is-leaving': leaving }">
    <div class="site-loader_layer site-loader_brand" aria-hidden="true" />

    <div class="site-loader_panel flex flex-col justify-between px-6 py-6 lg:px-10 lg:py-8">
      <div class="flex items-center justify-between font-mono text-[10px] tracking-[0.24em] text-muted">
        <span>ZHOUJUMP<span class="text-brand-500">.</span>COM</span>
        <span>V3</span>
      </div>

      <p class="font-display text-[10vw] leading-none font-semibold tracking-[-0.04em] text-paper/90 lg:text-[5vw]">
        MAKE IT RUN.
      </p>

      <div>
        <div class="flex items-end justify-between font-mono text-[10px] tracking-[0.2em] text-muted">
          <span>LOADING</span>
          <span class="font-display text-4xl font-semibold tabular-nums text-paper">
            {{ String(progress).padStart(3, '0') }}
          </span>
        </div>
        <div class="mt-2 h-px w-full bg-paper/15">
          <div class="h-px bg-brand-500 transition-[width] duration-150" :style="{ width: `${progress}%` }" />
        </div>
      </div>
    </div>
  </div>
</template>
