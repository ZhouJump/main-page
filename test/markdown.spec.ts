import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../server/utils/markdown'

describe('renderMarkdown', () => {
  it('保留文章中的原始 HTML', () => {
    const { html } = renderMarkdown('<div class="demo">box</div>')

    expect(html).toContain('<div class="demo">box</div>')
  })

  it('代码块里的 HTML 仍然按代码展示', () => {
    const { html } = renderMarkdown('```html\n<div class="demo">box</div>\n```')

    expect(html).toContain('&lt;div class=&quot;demo&quot;&gt;box&lt;/div&gt;')
  })

  it('把文章内的 style 限制在 .article-body 中', () => {
    const { html } = renderMarkdown('<style>input{display:none}</style>\n\n<div class="demo"><input /></div>')

    expect(html).toContain('.article-body input{display:none}')
  })

  it('不改写 keyframes 内部的选择器', () => {
    const { html } = renderMarkdown('<style>@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>')

    expect(html).toContain('@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}')
  })
})
