<script setup lang="ts">
// @ts-nocheck
import { CHAINS } from './heroChains'

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  const REF_W = 1440
  const REF_H = 842
  const NC = CHAINS.length

  const CFG = {
    omega: 0.7,
    bn: 6,
    bl: 1.2,
    fadeRatio: 0.2,
    shRatio: 30 / REF_W,
    dashColor: '#6A7681',
    blueColor: '#1E6EF3'
  }

  const STROKE_STOPS = [
    { w: 375, sw: 2.5 },
    { w: 1440, sw: 3.75 },
    { w: 2560, sw: 6.5 }
  ]

  const getStrokeWidth = (w: number) => {
    if (w <= STROKE_STOPS[0].w) return STROKE_STOPS[0].sw
    if (w >= STROKE_STOPS[STROKE_STOPS.length - 1].w) return STROKE_STOPS[STROKE_STOPS.length - 1].sw
    for (let i = 0; i < STROKE_STOPS.length - 1; i++) {
      const a = STROKE_STOPS[i]
      const b = STROKE_STOPS[i + 1]
      if (w >= a.w && w <= b.w) {
        const t = (w - a.w) / (b.w - a.w)
        return a.sw + (b.sw - a.sw) * t
      }
    }
    return STROKE_STOPS[1].sw
  }

  let W = 0
  let H = 0
  let dpr = 1
  let SCALE = 1
  let SH = 0
  let SW = 0
  let offX = 0
  let offY = 0

  const resize = () => {
    dpr = window.devicePixelRatio || 1
    W = el.clientWidth
    H = el.clientHeight
    el.width = W * dpr
    el.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    SCALE = Math.max(W / REF_W, H / REF_H)
    SH = SCALE * REF_W * CFG.shRatio
    SW = getStrokeWidth(W)
    offX = (W - REF_W * SCALE) / 2
    offY = (H - REF_H * SCALE) / 2
  }

  let phase = 0
  let lastTime = performance.now()
  let blues: { ci: number; slot: number; birth: number; life: number }[] = []
  let seeded = false
  let raf = 0

  const spawnBlue = (now: number) => {
    let tries = 0
    while (tries < 30) {
      const ci = (Math.random() * NC) | 0
      const T = CHAINS[ci].length
      const slot = (Math.random() * T) | 0
      let inUse = false
      for (let k = 0; k < blues.length; k++) {
        if (blues[k].ci === ci && blues[k].slot === slot) {
          inUse = true
          break
        }
      }
      if (!inUse) {
        blues.push({ ci, slot, birth: now, life: CFG.bl * (0.7 + Math.random() * 0.6) })
        return true
      }
      tries++
    }
    return false
  }

  const draw = (now: number) => {
    const t = now / 1000
    const dt = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    phase += CFG.omega * dt

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, W, H)
    ctx.lineWidth = SW
    ctx.lineCap = 'butt'

    const half = SH / 2
    const limX1 = -half - 4
    const limX2 = W + half + 4
    const limY1 = -half - 4
    const limY2 = H + half + 4

    if (!seeded) {
      for (let i = 0; i < CFG.bn; i++) spawnBlue(t)
      seeded = true
    }
    blues = blues.filter((b) => t - b.birth < b.life)
    while (blues.length < CFG.bn) {
      if (!spawnBlue(t)) break
    }
    const blueKeys = new Set<number>()
    for (let k = 0; k < blues.length; k++) blueKeys.add(blues[k].ci * 1000 + blues[k].slot)

    ctx.strokeStyle = CFG.dashColor
    ctx.beginPath()
    for (let ci = 0; ci < NC; ci++) {
      const chain = CHAINS[ci]
      const T = chain.length
      if (T < 2) continue
      for (let i = 0; i < T; i++) {
        let dp = (phase + i) % T
        if (dp < 0) dp += T
        const si = dp | 0
        if (si === T - 1) continue
        const sf = dp - si
        const a = chain[si]
        const b = chain[si + 1]
        const fx = a[0] + (b[0] - a[0]) * sf
        const fy = a[1] + (b[1] - a[1]) * sf
        const x = fx * SCALE + offX
        const y = fy * SCALE + offY
        if (x < limX1 || x > limX2 || y < limY1 || y > limY2) continue
        if (blueKeys.has(ci * 1000 + i)) continue
        ctx.moveTo(x, y - half)
        ctx.lineTo(x, y + half)
      }
    }
    ctx.stroke()

    ctx.strokeStyle = CFG.blueColor
    ctx.beginPath()
    for (let k = 0; k < blues.length; k++) {
      const b = blues[k]
      const chain = CHAINS[b.ci]
      const T = chain.length
      if (T < 2) continue
      let dp = (phase + b.slot) % T
      if (dp < 0) dp += T
      const si = dp | 0
      if (si === T - 1) continue
      const sf = dp - si
      const aa = chain[si]
      const bb = chain[si + 1]
      const fx = aa[0] + (bb[0] - aa[0]) * sf
      const fy = aa[1] + (bb[1] - aa[1]) * sf
      const x = fx * SCALE + offX
      const y = fy * SCALE + offY
      if (x < limX1 || x > limX2 || y < limY1 || y > limY2) continue
      ctx.moveTo(x, y - half)
      ctx.lineTo(x, y + half)
    }
    ctx.stroke()

    const fadeH = H * CFG.fadeRatio
    if (fadeH > 0) {
      const gT = ctx.createLinearGradient(0, 0, 0, fadeH)
      gT.addColorStop(0, 'rgba(0,0,0,1)')
      gT.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = gT
      ctx.fillRect(0, 0, W, fadeH)
      const gB = ctx.createLinearGradient(0, H - fadeH, 0, H)
      gB.addColorStop(0, 'rgba(0,0,0,0)')
      gB.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.fillStyle = gB
      ctx.fillRect(0, H - fadeH, W, fadeH)
    }

    if (running) {
      raf = requestAnimationFrame(draw)
    }
  }

  let lastW = window.innerWidth
  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  const onResize = () => {
    if (window.innerWidth <= 767 && window.innerWidth === lastW) return
    lastW = window.innerWidth
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(resize, 150)
  }

  window.addEventListener('resize', onResize)
  resize()

  // static first frame while the loader covers the screen; the loop starts
  // only once the loader has fully left (zj:loader-done)
  let running = false
  const begin = () => {
    if (running) return
    running = true
    lastTime = performance.now()
    raf = requestAnimationFrame(draw)
  }

  draw(performance.now())

  if ((window as unknown as { __zjLoaderDone?: boolean }).__zjLoaderDone) {
    begin()
  } else {
    window.addEventListener('zj:loader-done', begin, { once: true })
  }

  onBeforeUnmount(() => {
    window.removeEventListener('zj:loader-done', begin)
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    clearTimeout(resizeTimer)
  })
})
</script>

<template>
  <canvas ref="canvas" data-hero-canvas class="home-hero_canvas" />
</template>
