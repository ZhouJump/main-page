<script setup lang="ts">
import thHeroHtml from '~/assets/raw/th-hero.html?raw'
import { initHeroTicks } from './ticksScene'

const { isEn } = useLang()

// the hero copy lives inside the webflow html export, so swap the two h1
// lines after loading it
const html = computed(() =>
  isEn.value
    ? thHeroHtml.replace('把复杂的事，', 'Complex things,').replace('做得简单。', 'made simple.')
    : thHeroHtml
)

const root = ref<HTMLElement | null>(null)
let stop: (() => void) | null = null

// the ticks scene starts only after the first-paint loader has fully left
useAfterLoader(() => {
  if (root.value) stop = initHeroTicks(root.value)
})

onBeforeUnmount(() => {
  stop?.()
  stop = null
})
</script>

<template>
  <div ref="root" v-html="html" />
</template>
