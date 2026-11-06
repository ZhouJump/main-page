<script setup lang="ts">
withDefaults(
  defineProps<{
    items: string[]
    reverse?: boolean
    duration?: number
  }>(),
  {
    reverse: false,
    duration: 42
  }
)
</script>

<template>
  <div
    class="marquee relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    :class="reverse ? 'marquee-reverse' : ''"
  >
    <div
      class="marquee-track flex w-max items-stretch"
      :style="{ animationDuration: `${duration}s` }"
    >
      <div v-for="(item, index) in [...items, ...items]" :key="index" class="www-marquee-card">
        {{ item }}
      </div>
    </div>
  </div>
</template>
