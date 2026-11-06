<script setup lang="ts">
const props = withDefaults(defineProps<{ src: string; loop?: boolean; autoplay?: boolean }>(), {
  loop: true,
  autoplay: true
})

const host = ref<HTMLDivElement | null>(null)
let anim: { destroy: () => void } | null = null

onMounted(async () => {
  if (!host.value) return
  const { default: lottie } = await import('lottie-web')
  if (!host.value) return
  anim = lottie.loadAnimation({
    container: host.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    path: props.src,
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
  })
})

onBeforeUnmount(() => {
  anim?.destroy()
  anim = null
})
</script>

<template>
  <div ref="host" class="lottie-host" />
</template>
