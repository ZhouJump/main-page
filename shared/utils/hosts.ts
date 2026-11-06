export type SiteKind = 'www' | 'blog' | 'unknown'

export function normalizeHost(value: string | null | undefined): string {
  return (value ?? '').split(':')[0]?.trim().toLowerCase() ?? ''
}

export function resolveSite(host: string, wwwHost: string, blogHost: string): SiteKind {
  if (host === blogHost || host.startsWith('blog.')) {
    return 'blog'
  }

  if (host === wwwHost || host.startsWith('www.')) {
    return 'www'
  }

  if (host === 'localhost' || host === '127.0.0.1') {
    return 'www'
  }

  return 'unknown'
}

export function isLocalHost(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')
}
