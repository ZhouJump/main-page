<script setup lang="ts">
// @ts-nocheck
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import stackIllustration from '~/assets/raw/stack-illustration.svg?raw'
import stackDots from '~/assets/raw/stack-dots.svg?raw'
import { slide1EndPaths, slide2EndPaths, slide4EndPaths } from './stackMorph'

const root = ref<HTMLElement | null>(null)
const illustrationBox = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const activeProgress = ref(0)

const { isEn } = useLang()

const slides = computed(() =>
  (isEn.value
    ? [
        'Design, build, ship.',
        'One shared design system and components, reused directly.',
        'From idea to a working product, one step faster.',
        'Combine them to build what does not exist yet.',
        'Products or content — it all starts here.'
      ]
    : [
        '设计，构建，上线。',
        '一套共享的设计系统与组件，直接复用。',
        '从想法到可用的产品，快一步。',
        '把它们组合起来，做出还不存在的东西。',
        '无论做产品还是写内容，都从这里开始。'
      ]
  ).map((text) => ({ text, chars: text.split('').map((c) => (c === ' ' ? '\u00A0' : c)) }))
)

const plusPath = 'M6.75 5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25V0H6.75V5.25Z'

onMounted(() => {
  const section = root.value
  const box = illustrationBox.value
  if (!section || !box) return

  gsap.registerPlugin(ScrollTrigger)
  const slideEls = Array.from(section.querySelectorAll<HTMLElement>('[data-swiper-slide]'))
  const wordEls = slideEls.map((slide) => Array.from(slide.querySelectorAll<HTMLElement>('.stack-word')))

  // reference measures the tallest slide and pins the container height so the
  // dots row keeps its place in the card layout (height:100% would swallow it)
  const contentBox = section.querySelector<HTMLElement>('.home-stack_content')
  const setContainerHeight = () => {
    if (!contentBox) return
    gsap.set(slideEls, { autoAlpha: 1, position: 'static' })
    let max = 0
    slideEls.forEach((s) => {
      if (s.offsetHeight > max) max = s.offsetHeight
    })
    gsap.set(slideEls, { clearProps: 'position' })
    gsap.set(slideEls, { autoAlpha: 0 })
    contentBox.style.height = `${max}px`
  }
  setContainerHeight()

  gsap.set(slideEls, { autoAlpha: 0 })

  wordEls.forEach((words) => gsap.set(words, { yPercent: 100 }))
  gsap.set(slideEls[0], { autoAlpha: 1 })
  gsap.set(wordEls[0], { yPercent: 0 })

  let current = 0
  let activeTl: gsap.core.Timeline | null = null

  // dots stay in the DOM and are driven by CSS classes + inline width, so they
  // can never be hidden by a stale gsap tween
  const snapTo = (i: number, visible: boolean) => {
    gsap.killTweensOf([slideEls[i], wordEls[i]])
    if (visible) {
      gsap.set(slideEls[i], { autoAlpha: 1 })
      gsap.set(wordEls[i], { yPercent: 0 })
    } else {
      gsap.set(slideEls[i], { autoAlpha: 0 })
      gsap.set(wordEls[i], { yPercent: 100 })
    }
  }

  const goToSlide = (next: number) => {
    if (next === current) return
    const prev = current
    current = next
    if (activeTl) activeTl.kill()
    for (let i = 0; i < slides.value.length; i++) {
      if (i === next || i === prev) continue
      snapTo(i, false)
    }
    if (Math.abs(next - prev) > 1) {
      snapTo(prev, false)
      snapTo(next, true)
      return
    }
    gsap.killTweensOf([slideEls[prev], slideEls[next], wordEls[prev], wordEls[next]])
    gsap.set(slideEls[next], { autoAlpha: 1 })
    activeTl = gsap.timeline({
      onComplete: () => {
        if (current === next) {
          gsap.set(slideEls[prev], { autoAlpha: 0 })
          gsap.set(wordEls[prev], { yPercent: 100 })
        }
        activeTl = null
      }
    })
    activeTl.to(wordEls[prev], { yPercent: -100, stagger: 0.01, duration: 0.35 }, 0)
    activeTl.fromTo(wordEls[next], { yPercent: 100 }, { yPercent: 0, stagger: 0.01, duration: 0.35 }, 0.1)
  }

  const segment = 1 / slides.value.length
  const triggers: ScrollTrigger[] = []
  triggers.push(ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      const index = Math.min(Math.floor(self.progress / segment), slides.value.length - 1)
      const localP = (self.progress - index * segment) / segment
      activeProgress.value = localP
      if (index !== activeIndex.value) activeIndex.value = index
      if (index !== current) goToSlide(index)
    }
  }))

  // illustration: same staged morph sequence as the reference
  const svg = box.querySelector<SVGSVGElement>('[data-illustration-svg]')
  if (!svg) return

  const q = <T extends Element = Element>(sel: string) => svg.querySelector<T>(sel)
  const qa = <T extends Element = Element>(sel: string) => Array.from(svg.querySelectorAll<T>(sel))

  const pillars = q('[data-pillars]')
  const caps = qa('[data-caps-always]')
  const labels = q('[data-labels]')
  const outline = q('[data-outline-path]')
  const l3 = q('[data-l3-decorations]')
  const l3Lines = qa('[data-l3-deco-line]')
  const l3Circles = qa('[data-l3-deco-circle]')
  const legoCapsGroup = q('[data-lego-caps]')
  const legoCaps = qa('[data-lego-cap]').sort((a, b) => {
    const ax = parseFloat((a as HTMLElement).dataset.cx || '0') - 149.07
    const ay = parseFloat((a as HTMLElement).dataset.cy || '0') - 203.5
    const bx = parseFloat((b as HTMLElement).dataset.cx || '0') - 149.07
    const by = parseFloat((b as HTMLElement).dataset.cy || '0') - 203.5
    return Math.hypot(ax, ay) - Math.hypot(bx, by)
  })
  const cube = q('[data-cube]')
  const blueCube = q('[data-blue-cube]')
  const spreads = qa('[data-spread]')
  const roofClip = q('[data-roof-clip]')

  gsap.set([pillars, caps, labels, outline], { autoAlpha: 0 })
  gsap.set(l3, { autoAlpha: 0 })
  gsap.set(l3Circles, { scale: 0, transformOrigin: 'center center' })
  legoCaps.forEach((c) => {
    const el = c as HTMLElement
    gsap.set(c, { scale: 0, svgOrigin: `${el.dataset.cx} ${el.dataset.cy}` })
  })
  gsap.set(legoCapsGroup, { autoAlpha: 0 })
  gsap.set(cube, { scale: 0, transformOrigin: '165.43px 266.87px' })
  gsap.set(blueCube, { scale: 0, transformOrigin: '165.43px 120.51px' })

  const morphEls = new Map<string, SVGPathElement>()
  qa<SVGPathElement>('[data-morph]').forEach((el) => morphEls.set((el as HTMLElement).dataset.morph || '', el))
  const initial = new Map<string, string>()
  morphEls.forEach((el, key) => initial.set(key, el.getAttribute('d') || ''))

  const tokenize = (d: string) => (d.match(/[a-zA-Z]|-?\d*\.?\d+/g) || [])
  const interpolate = (a: string, b: string, t: number) => {
    const ta = tokenize(a)
    const tb = tokenize(b)
    if (ta.length !== tb.length) return t < 0.5 ? a : b
    const out: string[] = []
    for (let i = 0; i < ta.length; i++) {
      const x = parseFloat(ta[i])
      const y = parseFloat(tb[i])
      if (Number.isNaN(x) || Number.isNaN(y)) {
        out.push(t < 0.5 ? ta[i] : tb[i])
      } else {
        out.push(`${(x + (y - x) * t).toFixed(3)}`)
      }
    }
    return out.join(' ')
  }

  const dashSetup = (el: Element | null) => {
    if (!el) return 0
    const len = (el as SVGPathElement).getTotalLength?.() || 0
    el.setAttribute('stroke-dasharray', `${len}`)
    return len
  }
  const outlineLen = dashSetup(outline)
  const l3Lens = l3Lines.map((el) => dashSetup(el))

  const ease = (t: number) => t * t * (3 - 2 * t)
  const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const setMorph = (from: Record<string, string> | Map<string, string>, to: Record<string, string>, t: number) => {
    Object.entries(to).forEach(([key, d]) => {
      const el = morphEls.get(key)
      if (!el) return
      const startD = from instanceof Map ? from.get(key) || d : from[key] || d
      el.setAttribute('d', interpolate(startD, d, t))
    })
  }

  const apply = (p: number) => {
    // stage 0→20%: collapse into the base plate
    if (p <= 0.2) {
      setMorph(initial, slide1EndPaths, ease(clamp01(p / 0.2)))
    } else if (p <= 0.4) {
      const t = clamp01((p - 0.2) / 0.2)
      setMorph(slide1EndPaths, slide2EndPaths, ease(t))
      gsap.set(pillars, { autoAlpha: 1 })
      gsap.set(caps, { autoAlpha: t > 0.12 ? 1 : 0 })
      gsap.set(labels, { autoAlpha: t > 0.55 ? 1 : 0 })
      if (outline) gsap.set(outline, { autoAlpha: t > 0.15 ? 1 : 0 })
      if (outline) outline.setAttribute('stroke-dashoffset', `${outlineLen * (1 - clamp01((t - 0.2) / 0.75))}`)
    } else if (p <= 0.6) {
      const t = clamp01((p - 0.4) / 0.2)
      setMorph(slide2EndPaths, slide2EndPaths, 0)
      gsap.set(labels, { autoAlpha: 0 })
      if (outline) gsap.set(outline, { autoAlpha: t > 0.2 ? 0 : 1 })
      const capShift = clamp01((t - 0.1) / 0.25)
      const mapped: Record<string, number[]> = {
        left: [-0.3, 68.36],
        right: [-2.6, 68.36],
        'c-top': [-1.45, 68.93],
        'c-mid': [-1.45, 68.4],
        'c-bot': [-1.45, 67.78]
      }
      Object.entries(mapped).forEach(([name, [x, y]]) => {
        const el = q(`[data-cap-always][data-name="${name}"]`)
        if (el) gsap.set(el, { x: x * capShift, y: y * capShift })
      })
      spreads.forEach((el) => {
        el.setAttribute('rx', `${lerp(0, 130, clamp01((t - 0.2) / 0.5))}`)
        el.setAttribute('ry', `${lerp(0, 70, clamp01((t - 0.2) / 0.5))}`)
      })
      gsap.set(l3, { autoAlpha: t > 0.5 ? 1 : 0 })
      l3Lines.forEach((el, i) => {
        el.setAttribute('stroke-dashoffset', `${l3Lens[i]! * (1 - clamp01((t - 0.5) / 0.3))}`)
      })
      l3Circles.forEach((el) => gsap.set(el, { scale: t > 0.6 ? 1 : 0 }))
      if (t > 0.9) gsap.set(caps, { autoAlpha: 0 })
    } else if (p <= 0.8) {
      const t = clamp01((p - 0.6) / 0.2)
      setMorph(slide2EndPaths, slide4EndPaths, ease(t))
      if (roofClip) {
        const base = initial.get('0') || ''
        const el = roofClip as SVGPathElement
        el.setAttribute('d', interpolate(base, slide4EndPaths['0'], ease(t)))
      }
      gsap.set(l3, { autoAlpha: 0 })
      gsap.set(legoCapsGroup, { autoAlpha: t > 0.2 ? 1 : 0 })
      legoCaps.forEach((el, i) => {
        gsap.set(el, { scale: clamp01((t - 0.2 - i * 0.01) / 0.4) })
      })
      gsap.set(cube, { autoAlpha: t > 0.5 ? 1 : 0, scale: ease(clamp01((t - 0.5) / 0.35)) })
      gsap.set(blueCube, { autoAlpha: t > 0.5 ? 1 : 0, scale: ease(clamp01((t - 0.5) / 0.35)) })
    } else {
      setMorph(slide2EndPaths, slide4EndPaths, 1)
      gsap.set(legoCapsGroup, { autoAlpha: 1 })
      legoCaps.forEach((el) => gsap.set(el, { scale: 1 }))
      gsap.set(cube, { autoAlpha: 1, scale: 1 })
      gsap.set(blueCube, { autoAlpha: 1, scale: 1 })
    }
  }

  triggers.push(ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => apply(self.progress)
  }))
  apply(0)

  // re-measure the slide height when the viewport width changes (reference does the same)
  let lastW = window.innerWidth
  let resizeTimer = 0
  const onResize = () => {
    if (window.innerWidth === lastW) return
    lastW = window.innerWidth
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (activeTl) activeTl.kill()
      setContainerHeight()
      slideEls.forEach((el, i) => gsap.set(el, { autoAlpha: i === current ? 1 : 0 }))
      wordEls.forEach((words, i) => gsap.set(words, { yPercent: i === current ? 0 : 100 }))
    }, 200)
  }
  window.addEventListener('resize', onResize)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    window.clearTimeout(resizeTimer)
    triggers.forEach((t) => t.kill())
  })
})
</script>

<template>
  <section ref="root" class="home-stack">
    <WwwDivider position="top-100" />

    <div class="padding-global">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-vflex home-stack_layout" data-swiper>
          <div class="div-block-2">
            <div class="w-layout-grid home-stack_grid">
              <div class="w-layout-vflex home-stack_first-grid">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 12 12" fill="none" class="home-stack_plus-icon">
                  <path :d="plusPath" fill="currentColor" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 12 12" fill="none" class="home-stack_plus-icon top-right">
                  <path :d="plusPath" fill="currentColor" />
                </svg>

                <span class="ts-16px text-color-paper">The Zhoujump Stack</span>

                <div class="home-stack_content">
                  <h2
                    v-for="(slide, i) in slides"
                    :key="i"
                    class="h2-40px text-center mob_27px text-color-paper"
                    :data-swiper-slide="i + 1"
                  >
                    <span v-for="(c, j) in slide.chars" :key="j" class="stack-word-mask"><span class="stack-word">{{ c }}</span></span>
                  </h2>
                </div>

                <div class="home-stack_dots-wrapper">
                  <div
                    v-for="(_, i) in slides"
                    :key="i"
                    class="stack_dot"
                    :class="{ 'is--active': i === activeIndex }"
                    :data-swiper-dot="i + 1"
                  >
                    <div
                      class="stack_dot-progress"
                      :style="{ width: `${(i < activeIndex ? 1 : i === activeIndex ? activeProgress : 0) * 100}%` }"
                    />
                  </div>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 12 12" fill="none" class="home-stack_plus-icon bottom-left">
                  <path :d="plusPath" fill="currentColor" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 12 12" fill="none" class="home-stack_plus-icon bottom-right">
                  <path :d="plusPath" fill="currentColor" />
                </svg>
              </div>

              <div class="w-layout-vflex home-stack_second-grid">
                <div class="home-stack_dots-ilust" v-html="stackDots" />
                <div class="home-stack_ilust-wrapper">
                  <div class="code-embed-2 w-embed">
                    <div class="stack_sticky">
                      <div ref="illustrationBox" class="home-stack_illustration" data-illustration v-html="stackIllustration" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
