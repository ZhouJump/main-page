<script setup lang="ts">
withDefaults(defineProps<{ position?: 'flow' | 'top' | 'top-100' | 'bottom' }>(), { position: 'flow' })

const root = ref<HTMLElement | null>(null)
let raf = 0

onMounted(() => {
  const el = root.value
  if (!el) return

  const wrapper = el.querySelector<HTMLElement>('.divider-cube_wrapper')
  const cubes = Array.from(el.querySelectorAll<HTMLElement>('.divider-cube'))
  if (!wrapper || cubes.length < 2) return

  const first = cubes[0]!
  const last = cubes[1]!

  const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

  const render = () => {
    raf = 0
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const start = vh * 0.95
    const end = vh * 0.55 - rect.height
    const p = clamp((start - rect.top) / (start - end))
    const half = wrapper.offsetWidth / 2

    // the rule itself always spans the full width; only the two cubes slide
    // apart from the centre
    first.style.transform = `translateX(${half * (1 - p)}px)`
    last.style.transform = `translateX(${-half * (1 - p)}px)`
  }

  const schedule = () => {
    if (raf) return
    raf = requestAnimationFrame(render)
  }

  render()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (raf) cancelAnimationFrame(raf)
  })
})
</script>

<template>
  <div
    ref="root"
    class="divider-comp"
    :class="position === 'top' ? 'absolute-top' : position === 'top-100' ? 'absolute-top-100' : position === 'bottom' ? 'absolute-bottom' : ''"
  >
    <div class="w-layout-hflex divider-wrapper">
      <div class="padding-global full-width">
        <div class="w-layout-blockcontainer container-1440 w-container">
          <div class="w-layout-hflex divider-cube_wrapper">
            <div class="divider-cube" />
            <div class="divider-cube" />
          </div>
        </div>
      </div>
      <div class="divider-line negative dark-grey" />
    </div>
  </div>
</template>
