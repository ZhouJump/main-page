import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'

export type TocItem = {
  level: number
  id: string
  text: string
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || 'section'
}

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: false
})

markdown.use(anchor, {
  slugify,
  level: [2, 3],
  uniqueSlugStartIndex: 2
})

const ARTICLE_SCOPE = '.article-body'

function scopeSelectors(selectors: string): string {
  return selectors
    .split(',')
    .map((selector) => selector.trim())
    .filter(Boolean)
    .map((selector) => `${ARTICLE_SCOPE} ${selector}`)
    .join(', ')
}

// 文章内的 <style> 会随 v-html 注入全局，统一加上 .article-body 前缀，避免影响站点本身
function scopeCss(css: string): string {
  let output = ''
  let index = 0

  while (index < css.length) {
    const brace = css.indexOf('{', index)

    if (brace === -1) {
      output += css.slice(index)
      break
    }

    const prelude = css.slice(index, brace).trim()
    let depth = 1
    let cursor = brace + 1

    while (cursor < css.length && depth > 0) {
      if (css[cursor] === '{') depth += 1
      else if (css[cursor] === '}') depth -= 1
      cursor += 1
    }

    const body = css.slice(brace + 1, cursor - 1)

    if (prelude.startsWith('@')) {
      const nested =
        prelude.startsWith('@media') ||
        prelude.startsWith('@supports') ||
        prelude.startsWith('@layer') ||
        prelude.startsWith('@container')

      output += `${prelude}{${nested ? scopeCss(body) : body}}`
    } else {
      output += `${scopeSelectors(prelude)}{${body}}`
    }

    index = cursor
  }

  return output
}

function scopeArticleStyles(html: string): string {
  return html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs: string, css: string) => {
    return `<style${attrs}>${scopeCss(css)}</style>`
  })
}

export function renderMarkdown(source: string): { html: string; toc: TocItem[] } {
  const html = scopeArticleStyles(markdown.render(source))
  const toc: TocItem[] = []

  // headings also carry tabindex from markdown-it-anchor, so the id is not
  // necessarily the last attribute
  for (const match of html.matchAll(/<h([23])\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const [, level, id, text] = match

    if (!level || !id) {
      continue
    }

    toc.push({
      level: Number(level),
      id,
      text: (text ?? '').replace(/<[^>]+>/g, '').trim()
    })
  }

  return { html, toc }
}

export function plainText(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
