<script setup lang="ts">
// @ts-nocheck
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import dbIllust from '~/assets/raw/db-illust.html?raw'

const { isEn } = useLang()

const root = ref<HTMLElement | null>(null)
const illustBox = ref<HTMLElement | null>(null)

onMounted(() => {
  const section = root.value
  const box = illustBox.value
  if (!section || !box) return
  gsap.registerPlugin(ScrollTrigger)

  const blueCube = box.querySelector<SVGElement>('[data-cube-blue]')
  const blackCube = box.querySelector<SVGElement>('[data-cube-black]')
  const blackCubeMask = box.querySelector<SVGElement>('[data-cube-black-mask]')
  const blueLines = Array.from(box.querySelectorAll<SVGLineElement>('[data-blue-line]'))
  if (!blueCube || !blackCube || !blueLines.length) return

  blueCube.setAttribute('transform', 'translate(0 0)')
  blackCube.setAttribute('transform', 'translate(0 0)')
  if (blackCubeMask) blackCubeMask.setAttribute('transform', 'translate(0 -187)')

  const lineData = blueLines.map((l) => ({
    el: l,
    y1: parseFloat(l.getAttribute('y1') || '0'),
    y2: parseFloat(l.getAttribute('y2') || '0')
  }))

  const state = { p: 0 }
  const trigger = gsap.to(state, {
    p: 1,
    ease: 'power2.in',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'center 40%', scrub: true },
    onUpdate: () => {
      const e = state.p
      const blackY = 187 * e
      blueCube.setAttribute('transform', `translate(0 ${532 * e})`)
      blackCube.setAttribute('transform', `translate(0 ${blackY})`)
      if (blackCubeMask) blackCubeMask.setAttribute('transform', `translate(0 ${blackY - 187})`)
      lineData.forEach((d) => {
        d.el.setAttribute('y1', `${d.y1 + (d.y2 - d.y1) * e}`)
      })
    }
  })

  onBeforeUnmount(() => {
    trigger.scrollTrigger?.kill()
    trigger.kill()
  })
})
</script>

<template>
  <section ref="root" data-db class="home-db container-1440">
    <div class="mw-860">
      <h2 data-reveal class="h2-102px text-center">{{ isEn ? 'Things built together' : '一起做出来的东西' }}</h2>
    </div>
    <div ref="illustBox" class="home-db_ilust-wrapper" v-html="dbIllust" />
  </section>
</template>
