<script setup lang="ts">
// @ts-nocheck
import gsap from 'gsap'
import ctaBg from '~/assets/raw/cta-desktop.svg?raw'

const { isEn, wwwPrefix } = useLang()

const root = ref<HTMLElement | null>(null)
const bgBox = ref<HTMLElement | null>(null)

onMounted(() => {
  const section = root.value
  const box = bgBox.value
  if (!section || !box) return
  const svgEl = box.querySelector('svg')
  if (!svgEl) return
  const lines = Array.from(section.querySelectorAll<SVGPathElement>('[data-line]'))
  if (!lines.length) return
  if (window.matchMedia('(hover: none)').matches) return

  const RADIUS = 140
  const MIN_COMPRESS = 0.4
  const COMPRESS_EASE = 8
  const BLUR_INFLUENCE = 280
  const BLUR_PUSH = 110
  const BLUR_EASE = 6

  const blurs = Array.from(section.querySelectorAll<SVGGElement>('[data-blur]')).map((g) => ({
    el: g,
    bx: parseFloat(g.getAttribute('data-bx') || '0'),
    by: parseFloat(g.getAttribute('data-by') || '0'),
    tx: 0,
    ty: 0,
    lastTx: -9999,
    lastTy: -9999
  }))

  const tokenize = (d: string) => {
    const tokens: { cmd: string; nums: number[]; original: number[] }[] = []
    let i = 0
    while (i < d.length) {
      const c = d[i]!
      if (/[a-zA-Z]/.test(c)) {
        const cmd = c
        i++
        const nstart = i
        while (i < d.length && !/[a-zA-Z]/.test(d[i]!)) i++
        const nstr = d.substring(nstart, i)
        const nums = (nstr.match(/-?\d+\.?\d*/g) || []).map((n) => parseFloat(n))
        tokens.push({ cmd, nums, original: nums.slice() })
      } else {
        i++
      }
    }
    return tokens
  }

  const smoothstep = (t: number) => t * t * (3 - 2 * t)

  const lineData = lines
    .map((line) => {
      const d = line.getAttribute('d') || ''
      const tokens = tokenize(d)
      const origD = tokens.map((t) => t.cmd + t.nums.join(' ')).join('')
      const xs: number[] = []
      tokens.forEach((t) => {
        const cu = t.cmd.toUpperCase()
        if (cu === 'M' || cu === 'L' || cu === 'T') xs.push(t.nums[0]!)
        else if (cu === 'C') xs.push(t.nums[0]!, t.nums[2]!, t.nums[4]!)
        else if (cu === 'S' || cu === 'Q') xs.push(t.nums[0]!, t.nums[2]!)
        else if (cu === 'H') xs.push(t.nums[0]!)
      })
      if (xs.length < 4) return null
      const sortedXs = [...xs].sort((a, b) => a - b)
      const cx = (sortedXs[0]! + sortedXs[sortedXs.length - 1]!) / 2
      const wideMin = sortedXs[Math.floor(sortedXs.length * 0.05)]!
      const wideMax = sortedXs[Math.floor(sortedXs.length * 0.95)]!
      const isWide = (x: number) => x < wideMin + 1.5 || x > wideMax - 1.5

      const samples: { x: number; y: number }[] = []
      let curX = 0
      let curY = 0
      tokens.forEach((t) => {
        const cu = t.cmd.toUpperCase()
        if (cu === 'M' || cu === 'L' || cu === 'T') {
          curX = t.nums[0]!
          curY = t.nums[1]!
          samples.push({ x: curX, y: curY })
        } else if (cu === 'C') {
          curX = t.nums[4]!
          curY = t.nums[5]!
          samples.push({ x: curX, y: curY })
        } else if (cu === 'V') {
          curY = t.nums[0]!
          samples.push({ x: curX, y: curY })
        } else if (cu === 'H') {
          curX = t.nums[0]!
          samples.push({ x: curX, y: curY })
        }
      })

      const ranges: [number, number][] = []
      let inBalloon = false
      let balloonStart = 0
      samples.forEach((s) => {
        if (isWide(s.x) && !inBalloon) {
          inBalloon = true
          balloonStart = s.y
        } else if (!isWide(s.x) && inBalloon) {
          inBalloon = false
          ranges.push([Math.min(balloonStart, s.y), Math.max(balloonStart, s.y)])
        }
      })

      const balloons: {
        y0: number
        y1: number
        cy: number
        lockedAnchor: number | null
        currentCompress: number
      }[] = []
      const used = new Array(ranges.length).fill(false)
      ranges.forEach((r1, i) => {
        if (used[i]) return
        let bestJ = -1
        let bestDist = Infinity
        ranges.forEach((r2, j) => {
          if (i === j || used[j]) return
          const c1 = (r1[0] + r1[1]) / 2
          const c2 = (r2[0] + r2[1]) / 2
          const dist = Math.abs(c1 - c2)
          if (dist < bestDist && dist < 30) {
            bestDist = dist
            bestJ = j
          }
        })
        if (bestJ >= 0) {
          used[i] = used[bestJ] = true
          const merged: [number, number] = [Math.min(r1[0], ranges[bestJ]![0]), Math.max(r1[1], ranges[bestJ]![1])]
          balloons.push({ y0: merged[0], y1: merged[1], cy: (merged[0] + merged[1]) / 2, lockedAnchor: null, currentCompress: 1 })
        } else {
          used[i] = true
          balloons.push({ y0: r1[0], y1: r1[1], cy: (r1[0] + r1[1]) / 2, lockedAnchor: null, currentCompress: 1 })
        }
      })

      return { el: line, tokens, origD, cx, balloons, atRest: true, lastWritten: origD }
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v))

  const buildPath = (data: (typeof lineData)[number], mouseX: number, mouseY: number, intensity: number, dt: number) => {
    const { tokens, cx, balloons } = data
    const xDist = Math.abs(cx - mouseX)
    const farX = xDist > RADIUS + 2
    const lerpFactor = 1 - Math.exp(-COMPRESS_EASE * dt)
    let allRest = true

    for (let i = 0; i < balloons.length; i++) {
      const b = balloons[i]!
      let target = 1
      if (!farX) {
        const dx = cx - mouseX
        const dy = mouseY < b.y0 ? b.y0 - mouseY : mouseY > b.y1 ? mouseY - b.y1 : 0
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < RADIUS) {
          const t = 1 - dist / RADIUS
          const force = (1 - Math.pow(1 - t, 3)) * intensity
          target = 1 - (1 - MIN_COMPRESS) * force
        }
      }
      b.currentCompress += (target - b.currentCompress) * lerpFactor
      if (Math.abs(b.currentCompress - 1) > 0.001) allRest = false
      if (b.currentCompress >= 0.999) b.lockedAnchor = null
      else if (b.lockedAnchor === null) b.lockedAnchor = mouseY < b.cy ? b.y1 : b.y0
    }

    if (allRest) {
      if (data.atRest) return null
      data.atRest = true
      return data.origD
    }
    data.atRest = false

    const transformY = (y: number) => {
      for (let i = 0; i < balloons.length; i++) {
        const b = balloons[i]!
        const c = b.currentCompress
        if (c >= 0.999) continue
        const a = b.lockedAnchor !== null ? b.lockedAnchor : mouseY < b.cy ? b.y1 : b.y0
        if (y >= b.y0 - 1 && y <= b.y1 + 1) return a + (y - a) * c
        const pad = 30
        if (y >= b.y0 - pad && y < b.y0) {
          const t = (b.y0 - y) / pad
          const blend = smoothstep(1 - t)
          const yNew = a + (y - a) * (1 - (1 - c) * blend)
          return yNew < b.y0 ? yNew : b.y0
        }
        if (y > b.y1 && y <= b.y1 + pad) {
          const t = (y - b.y1) / pad
          const blend = smoothstep(1 - t)
          const yNew = a + (y - a) * (1 - (1 - c) * blend)
          return yNew > b.y1 ? yNew : b.y1
        }
      }
      return y
    }

    let out = ''
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]!
      const cu = t.cmd.charCodeAt(0) & 0xdf
      const o = t.original
      const n = t.nums
      if (cu === 86) n[0] = transformY(o[0]!)
      else if (cu === 67) {
        n[0] = o[0]!
        n[1] = transformY(o[1]!)
        n[2] = o[2]!
        n[3] = transformY(o[3]!)
        n[4] = o[4]!
        n[5] = transformY(o[5]!)
      } else if (cu === 76 || cu === 77 || cu === 84) {
        n[0] = o[0]!
        n[1] = transformY(o[1]!)
      } else if (cu === 83 || cu === 81) {
        n[0] = o[0]!
        n[1] = transformY(o[1]!)
        n[2] = o[2]!
        n[3] = transformY(o[3]!)
      } else {
        for (let j = 0; j < o.length; j++) n[j] = o[j]!
      }
      out += t.cmd
      for (let j = 0; j < n.length; j++) {
        if (j > 0) out += ' '
        out += (n[j]! | 0) === n[j] ? `${n[j]}` : (n[j]!).toFixed(1)
      }
    }
    return out
  }

  const state = { mx: -9999, my: -9999, intensity: 0 }
  let lastTime = performance.now()
  let cachedRect: DOMRect | null = null
  let rectDirty = true
  const invalidateRect = () => {
    rectDirty = true
  }
  window.addEventListener('resize', invalidateRect, { passive: true })
  window.addEventListener('scroll', invalidateRect, { passive: true })

  const TARGET_INTERVAL = 1000 / 50
  let accum = 0
  let ticker: (() => void) | null = null

  const render = () => {
    const now = performance.now()
    const dt = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    accum += dt * 1000
    if (accum < TARGET_INTERVAL) return
    accum = 0

    if (rectDirty || !cachedRect) {
      cachedRect = svgEl.getBoundingClientRect()
      rectDirty = false
    }
    const sx = 1440 / cachedRect.width
    const sy = 810 / cachedRect.height
    const px = (state.mx - cachedRect.left) * sx
    const py = (state.my - cachedRect.top) * sy

    for (let i = 0; i < lineData.length; i++) {
      const d = lineData[i]!
      const newD = buildPath(d, px, py, state.intensity, dt)
      if (newD !== null && newD !== d.lastWritten) {
        d.el.setAttribute('d', newD)
        d.lastWritten = newD
      }
    }

    const blurLerp = 1 - Math.exp(-BLUR_EASE * dt)
    for (let i = 0; i < blurs.length; i++) {
      const b = blurs[i]!
      const dx = b.bx - px
      const dy = b.by - py
      const dist = Math.sqrt(dx * dx + dy * dy)
      let txTarget = 0
      let tyTarget = 0
      if (dist < BLUR_INFLUENCE && dist > 0.01) {
        const t = 1 - dist / BLUR_INFLUENCE
        const force = (1 - Math.pow(1 - t, 2)) * state.intensity * BLUR_PUSH
        txTarget = (dx / dist) * force
        tyTarget = (dy / dist) * force
      }
      b.tx += (txTarget - b.tx) * blurLerp
      b.ty += (tyTarget - b.ty) * blurLerp
      if (Math.abs(b.tx - b.lastTx) > 0.3 || Math.abs(b.ty - b.lastTy) > 0.3) {
        b.el.setAttribute('transform', `translate(${b.tx.toFixed(1)} ${b.ty.toFixed(1)})`)
        b.lastTx = b.tx
        b.lastTy = b.ty
      }
    }
  }

  const iTo = gsap.quickTo(state, 'intensity', { duration: 0.4, ease: 'power2.out' })

  const startTicker = () => {
    if (ticker) return
    lastTime = performance.now()
    accum = 0
    invalidateRect()
    ticker = render
    gsap.ticker.add(ticker)
  }
  const stopTicker = () => {
    if (state.intensity < 0.001 && ticker) {
      gsap.ticker.remove(ticker)
      ticker = null
    }
  }

  let pendingX = 0
  let pendingY = 0
  let hasPending = false
  const flushMouse = () => {
    if (!hasPending) return
    state.mx = pendingX
    state.my = pendingY
    hasPending = false
  }

  const onMove = (e: MouseEvent) => {
    pendingX = e.clientX
    pendingY = e.clientY
    hasPending = true
    if (state.mx === -9999) {
      state.mx = pendingX
      state.my = pendingY
      hasPending = false
    }
    iTo(1)
    startTicker()
  }

  gsap.ticker.add(flushMouse)

  const onLeave = () => {
    iTo(0)
    gsap.delayedCall(2, stopTicker)
  }

  section.addEventListener('mousemove', onMove, { passive: true })
  section.addEventListener('mouseleave', onLeave, { passive: true })

  onBeforeUnmount(() => {
    section.removeEventListener('mousemove', onMove)
    section.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', invalidateRect)
    window.removeEventListener('scroll', invalidateRect)
    gsap.ticker.remove(flushMouse)
    if (ticker) gsap.ticker.remove(ticker)
  })
})
</script>

<template>
  <section id="cta-section" ref="root" class="home-cta">
    <div ref="bgBox" class="cta-hero_bg desktop_only w-embed" v-html="ctaBg" />
    <div class="padding-global z-index-2">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-vflex home-cta_layout">
          <span class="home-cta_subtitle">Ethos / Statement</span>
          <div class="w-layout-vflex gap-32 vx-center mob_48">
            <div class="mob_mw-320 hide-mob">
              <h2 data-reveal class="h2-81px text-center mob_40px">{{ isEn ? 'Make ideas' : '把想法' }}<br />{{ isEn ? 'actually run' : '真正跑起来' }}</h2>
            </div>
            <div class="mob_mw-320 only-mob">
              <h2 class="h2-81px text-center mob_40px">{{ isEn ? 'Make ideas actually run' : '把想法真正跑起来' }}</h2>
            </div>
            <div class="w-layout-vflex gap-32 vx-center mobile_24">
              <div class="mw-360 mob_mw-300">
                <p class="ts-18px text-center mob_16px">{{ isEn ? 'The best products stand on the most solid foundations.' : '最好的产品，来自最扎实的基础。' }}</p>
              </div>
              <div class="w-layout-hflex gap-8 mob_gap-4">
                <NuxtLink global="textStagger" :to="`${wwwPrefix}/project`" class="cta-button is--blue">
                  <span global-target>{{ isEn ? 'Start a project' : '开始一个项目' }}</span>
                </NuxtLink>
                <NuxtLink global="textStagger" :to="`${wwwPrefix}/about`" class="cta-button">
                  <span global-target>{{ isEn ? 'Meet me' : '认识我' }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
