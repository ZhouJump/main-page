export function useSite() {
  const config = useRuntimeConfig()
  const route = useRoute()

  // the journal now lives on the main domain under /blog (chinese) and /en/blog
  const isBlog = computed(
    () =>
      route.path === '/blog' ||
      route.path.startsWith('/blog/') ||
      route.path === '/en/blog' ||
      route.path.startsWith('/en/blog/')
  )
  const wwwUrl = computed(() => String(config.public.siteWwwUrl).replace(/\/$/, ''))
  const blogUrl = computed(() => `${wwwUrl.value}/blog`)
  const baseURL = computed(() => wwwUrl.value)

  return { site: computed(() => (isBlog.value ? 'blog' : 'www')), isBlog, wwwUrl, blogUrl, baseURL }
}
