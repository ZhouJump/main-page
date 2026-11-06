<script setup lang="ts">
const nuxtApp = useNuxtApp()

const state = ref<'idle' | 'covering' | 'revealing'>('idle')
const reduced = import.meta.client
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

// a layer slides for 500ms; the brand layer starts a bit before the grey one is gone
const LAYER_MS = 500
const BRAND_DELAY_MS = 180
const COVER_MS = LAYER_MS
// the out-in page transition keeps the old page on screen for 300ms
const PAGE_LEAVE_MS = 300

let startedAt = 0
let revealTimer: number | undefined
let guardTimer: number | undefined
let idleTimer: number | undefined
let entranceTimer: number | undefined

const reveal = () => {
  window.clearTimeout(revealTimer)
  window.clearTimeout(guardTimer)
  window.clearTimeout(entranceTimer)

  if (state.value !== 'covering') {
    return
  }

  state.value = 'revealing'

  // the screen is fully covered: the scroll may be reset without being seen
  window.dispatchEvent(new CustomEvent('zj:curtain-covered'))

  // the page becomes visible when the brand layer starts to lift
  entranceTimer = window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent('zj:curtain-reveal'))
  }, BRAND_DELAY_MS - 20)

  idleTimer = window.setTimeout(() => {
    state.value = 'idle'
  }, LAYER_MS + BRAND_DELAY_MS + 60)
}

const cover = () => {
  if (reduced) {
    return
  }

  window.clearTimeout(revealTimer)
  window.clearTimeout(guardTimer)
  window.clearTimeout(idleTimer)
  window.clearTimeout(entranceTimer)

  state.value = 'covering'
  startedAt = performance.now()
  guardTimer = window.setTimeout(reveal, 3200)
}

nuxtApp.$router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    cover()
  }
})

nuxtApp.hook('page:finish', () => {
  if (reduced || state.value !== 'covering') {
    return
  }

  const elapsed = performance.now() - startedAt
  // reveal once the curtain is fully closed and the new page is mounted
  const wait = Math.max(COVER_MS - elapsed, PAGE_LEAVE_MS) + 60

  window.clearTimeout(revealTimer)
  revealTimer = window.setTimeout(reveal, wait)
})
</script>

<template>
  <div class="route-curtain" :class="`is-${state}`" aria-hidden="true">
    <div class="route-curtain_layer route-curtain_brand" />
    <div class="route-curtain_layer route-curtain_ink" />
  </div>
</template>
