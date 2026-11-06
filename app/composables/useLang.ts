export function useLang() {
  const route = useRoute()

  // the english version lives under /en (including the journal at /en/blog)
  const isEn = computed(() => route.path === '/en' || route.path.startsWith('/en/'))

  const wwwPrefix = computed(() => (isEn.value ? '/en' : ''))

  // switching language keeps the current path and only swaps the prefix
  const switchTo = computed(() => {
    const path = route.path

    if (path === '/blog' || path.startsWith('/blog/')) return path.replace(/^\/blog/, '/en/blog')
    if (path === '/en' || path.startsWith('/en/')) return path.replace(/^\/en/, '') || '/'
    return `/en${path === '/' ? '' : path}`
  })

  return { isEn, wwwPrefix, switchTo }
}
