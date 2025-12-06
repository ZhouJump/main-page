import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  outDir: './dist',
  title: "粥粥技术记录",
  description: "个人技术与项目记录展示站",
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap', rel: 'stylesheet' }],
    ['script', { charset: 'utf-8', id: 'LA_COLLECT', src: '//sdk.51.la/js-sdk-pro.min.js?id=3JzdjakNrCyaUiKx&ck=3JzdjakNrCyaUiKx' }]
  ],
  cleanUrls: true,
  sitemap: {
    hostname: 'https://www.zhoujump.club',
  }
})
