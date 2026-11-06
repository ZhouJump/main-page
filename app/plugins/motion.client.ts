import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CustomEase from 'gsap/CustomEase'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  CustomEase.create('www', 'M0,0 C0.65,0 0.35,1 1,1')

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = reduced
    ? null
    : new Lenis({
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1
      })

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
  }

  const animatePage = (base: number) => {
    const heroLines = gsap.utils.toArray<HTMLElement>('[data-hero-line]')

    heroLines.forEach((line, index) => {
      gsap.from(line, {
        yPercent: 112,
        duration: 1.15,
        delay: base + 0.12 + index * 0.09,
        ease: 'www'
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-hero]').forEach((element, index) => {
      gsap.from(element, {
        y: 28,
        opacity: 0,
        duration: 1,
        delay: base + 0.25 + index * 0.08,
        ease: 'www'
      })
    })

    setupReveal()
  }

  // IntersectionObserver is independent of the scroll source, so reveals also work
  // while the page is driven by Lenis (or programmatically)
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        revealObserver.unobserve(entry.target)
        gsap.to(entry.target, { y: 0, opacity: 1, duration: 1.05, ease: 'www' })
      })
    },
    { rootMargin: '0px 0px -10% 0px' }
  )

  const setupReveal = () => {
    revealObserver.disconnect()

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.set(element, { y: 64, opacity: 0 })
      revealObserver.observe(element)
    })
  }

  const playEntrance = (base: number) => {
    animatePage(base)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  // the reveal event fires after the new page mounted, but poll once more so a slow
  // render can never leave the entrance animations attached to the page that left
  const playAfterReveal = () => {
    let frames = 0

    const check = () => {
      if (document.querySelector('[data-hero-line], [data-hero], [data-reveal]') || frames > 40) {
        playEntrance(0)
        return
      }

      frames += 1
      requestAnimationFrame(check)
    }

    requestAnimationFrame(check)
  }

  const resetScroll = () => {
    const hash = nuxtApp.$router.currentRoute.value.hash

    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))

      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -96, immediate: true })
        } else {
          target.scrollIntoView()
        }
        return
      }
    }

    window.scrollTo(0, 0)

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
    }
  }

  let firstFinish = true

  const loaderDone = () => Boolean((window as unknown as { __zjLoaderDone?: boolean }).__zjLoaderDone)

  const reveal = () => {
    if (reduced) {
      return
    }

    if (!firstFinish) {
      playEntrance(0)
      return
    }

    // first paint: never start before the loader curtain is gone (gsap is only ready by then).
    if (loaderDone()) {
      playEntrance(0.1)
      return
    }

    let started = false

    const start = () => {
      if (started) {
        return
      }

      started = true
      window.removeEventListener('zj:loader-done', start)
      playEntrance(0.1)
    }

    window.addEventListener('zj:loader-done', start)
    // hard-stop path: rAF can be paused in background tabs, in that case the
    // loader leaves at 2600ms and needs another 760ms to fully exit
    window.setTimeout(start, 3400)
  }

  nuxtApp.hook('page:start', () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })

  nuxtApp.hook('page:finish', () => {
    // first paint: the page is already in the DOM, wait for the loading curtain to lift
    if (firstFinish) {
      firstFinish = false
      reveal()
      return
    }

    // the route curtain resets the scroll once it fully covers the screen, so the
    // jump to the top is never visible; without motion there is no curtain at all
    if (reduced) {
      resetScroll()
      lenis?.resize()
    }
  })

  if (!reduced) {
    window.addEventListener('zj:curtain-covered', () => {
      resetScroll()
      lenis?.resize()
    })
    window.addEventListener('zj:curtain-reveal', playAfterReveal)
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
      lenis
    }
  }
})
