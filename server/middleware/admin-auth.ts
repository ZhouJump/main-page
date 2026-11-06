import { normalizeHost, resolveSite } from '../../shared/utils/hosts'

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return
  }

  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return
  }

  const config = useRuntimeConfig(event)
  const host = normalizeHost(getRequestHeader(event, 'host'))
  const blogHost = normalizeHost(new URL(config.public.siteBlogUrl || 'https://blog.zhoujump.com').host)
  const wwwHost = normalizeHost(new URL(config.public.siteWwwUrl || 'https://www.zhoujump.com').host)

  // blog 域名的 /admin 页面交给 host 中间件跳转到 www；API 仍必须校验会话
  if (!pathname.startsWith('/api/admin') && resolveSite(host, wwwHost, blogHost) === 'blog') {
    return
  }

  const session = await getUserSession(event)

  if (!session.user) {
    if (pathname.startsWith('/api/admin')) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    return sendRedirect(event, '/admin/login', 302)
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.method)) {
    const origin = getRequestHeader(event, 'origin')

    if (origin) {
      const originHost = normalizeHost(new URL(origin).host)

      if (originHost !== host && originHost !== wwwHost) {
        throw createError({ statusCode: 403, statusMessage: 'Origin 校验失败' })
      }
    }
  }
})
