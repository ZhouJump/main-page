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
    ['script', { src: 'https://umami.zhoujump.club/script.js', 'data-website-id': '85742351-c4fa-4d78-a116-3e2ea3b1897b', defer: ''}]
  ],
  cleanUrls: true,
  sitemap: {
    hostname: 'https://www.zhoujump.club',
  }
})
