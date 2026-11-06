import { isLocalHost, normalizeHost, resolveSite, type SiteKind } from '../../shared/utils/hosts'
import { blogToWwwPath, legacyLanguageAlias, wwwToBlogPath } from '../../shared/utils/redirects'

function siteBaseUrl(site: SiteKind, config: ReturnType<typeof useRuntimeConfig>, localHost: string, protocol: string, port: string) {
  if (isLocalHost(localHost)) {
    return `${protocol}//${site}.localhost${port}`
  }

  return site === 'blog'
    ? String(config.public.siteBlogUrl)
    : String(config.public.siteWwwUrl)
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const host = normalizeHost(getRequestHeader(event, 'host'))

  const wwwHost = normalizeHost(new URL(config.public.siteWwwUrl || 'https://www.zhoujump.com').host)
  const blogHost = normalizeHost(new URL(config.public.siteBlogUrl || 'https://blog.zhoujump.com').host)

  const resolved = resolveSite(host, wwwHost, blogHost)
  // 未知域名按主站处理，避免 IP 访问时无页面
  const site: SiteKind = resolved === 'blog' ? 'blog' : 'www'

  event.context.site = site
  event.context.host = host

  const port = requestUrl.port ? `:${requestUrl.port}` : ''
  const pathname = requestUrl.pathname

  const languageAlias = legacyLanguageAlias(pathname)
  if (languageAlias) {
    const target = new URL(siteBaseUrl('www', config, host, requestUrl.protocol, port))
    target.pathname = languageAlias
    return sendRedirect(event, target.toString(), 301)
  }

  // blog 子域整体并入主站 /blog，admin 保持原路径
  if (site === 'blog') {
    const target = new URL(siteBaseUrl('www', config, host, requestUrl.protocol, port))
    target.pathname = blogToWwwPath(pathname)
    target.search = requestUrl.search
    return sendRedirect(event, target.toString(), 301)
  }

  // 主站上的旧博客路径 301 到 /blog 前缀
  const nextPath = wwwToBlogPath(pathname)
  if (!nextPath) {
    return
  }

  const target = new URL(siteBaseUrl('www', config, host, requestUrl.protocol, port))
  target.pathname = nextPath
  target.search = requestUrl.search

  return sendRedirect(event, target.toString(), 301)
})
