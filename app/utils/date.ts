export function formatDate(value: string, lang: 'zh' | 'en'): string {
  const date = new Date(value)

  if (lang === 'en') {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
