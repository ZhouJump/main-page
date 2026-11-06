<script setup lang="ts">
withDefaults(
  defineProps<{
    src?: string
    alt?: string
    label?: string
    hint?: string
    ratio?: string
    rounded?: boolean
  }>(),
  {
    label: 'ASSET',
    hint: '',
    ratio: '16 / 10',
    rounded: true
  }
)
</script>

<template>
  <div
    class="asset-frame relative flex items-center justify-center overflow-hidden border border-paper/15 bg-ink-800"
    :class="rounded ? 'rounded-md' : ''"
    :style="{ aspectRatio: ratio }"
  >
    <img v-if="src" :src="src" :alt="alt ?? label" class="size-full object-cover" loading="lazy" decoding="async" />

    <div v-else class="flex flex-col items-center gap-2 px-6 text-center">
      <span class="font-mono text-[10px] tracking-[0.24em] text-muted/80">{{ label }}</span>
      <span v-if="hint" class="font-mono text-[9px] tracking-[0.16em] text-muted/50">{{ hint }}</span>
    </div>

    <span class="pointer-events-none absolute left-2 top-2 size-2 border-l border-t border-paper/30" aria-hidden="true" />
    <span class="pointer-events-none absolute right-2 top-2 size-2 border-r border-t border-paper/30" aria-hidden="true" />
    <span class="pointer-events-none absolute bottom-2 left-2 size-2 border-b border-l border-paper/30" aria-hidden="true" />
    <span class="pointer-events-none absolute bottom-2 right-2 size-2 border-r border-b border-paper/30" aria-hidden="true" />
  </div>
</template>
