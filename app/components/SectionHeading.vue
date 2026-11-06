<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  {
    align: 'left'
  }
)
</script>

<template>
  <div class="flex flex-col gap-4" :class="align === 'center' ? 'items-center text-center' : ''">
    <p v-if="eyebrow" class="font-mono text-[10px] tracking-[0.3em] text-brand-500">{{ eyebrow }}</p>
    <h2 class="font-display text-3xl leading-[1.02] font-semibold tracking-tight md:text-5xl">
      {{ title }}
    </h2>
    <p v-if="description" class="max-w-2xl text-sm leading-7 text-muted">{{ description }}</p>
  </div>
</template>
