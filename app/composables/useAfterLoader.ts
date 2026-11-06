// hero visuals must not start while the first-paint loader is still leaving the
// screen; on later route visits the loader is long gone, so start immediately
export function useAfterLoader(start: () => void) {
  let ready = false

  const begin = () => {
    if (ready) {
      return
    }

    ready = true
    start()
  }

  onMounted(() => {
    if ((window as unknown as { __zjLoaderDone?: boolean }).__zjLoaderDone) {
      begin()
      return
    }

    window.addEventListener('zj:loader-done', begin, { once: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('zj:loader-done', begin)
  })
}
