<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
    suffix?: string
    duration?: number
  }>(),
  {
    suffix: '',
    duration: 1200
  }
)

const current = ref(0)
const target = ref<HTMLElement | null>(null)

let frame = 0

function animate() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced || props.duration <= 0) {
    current.value = props.value
    return
  }

  const start = performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - start) / props.duration, 1)
    const eased = 1 - (1 - progress) ** 3
    current.value = Math.round(props.value * eased)

    if (progress < 1) {
      frame = requestAnimationFrame(tick)
    }
  }

  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  if (!target.value) {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        observer.disconnect()
        animate()
      }
    },
    { threshold: 0.4 }
  )

  observer.observe(target.value)
})

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <span ref="target" class="tabular-nums">{{ current }}{{ suffix }}</span>
</template>
