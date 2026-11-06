<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    to?: string
    href?: string
    variant?: 'white' | 'blue' | 'ghost' | 'black'
    arrow?: boolean
  }>(),
  { variant: 'white', arrow: true }
)

const NuxtLink = resolveComponent('NuxtLink')
const tag = computed(() => (props.href ? 'a' : NuxtLink))
const linkAttrs = computed(() =>
  props.href
    ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
    : { to: props.to ?? '/' }
)
const variantClass = computed(() => {
  if (props.variant === 'blue') return 'is--blue'
  if (props.variant === 'ghost' || props.variant === 'black') return 'is--black'
  return ''
})
</script>

<template>
  <component :is="tag" v-bind="linkAttrs" global="textStagger" class="cta-button" :class="variantClass">
    <span global-target>{{ label }}</span>
  </component>
</template>
