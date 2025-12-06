import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  outDir: '../public',
  title: "粥粥技术记录",
  description: "个人技术与项目记录展示站",
  head: [
    ['script', { charset: 'utf-8', id: 'LA_COLLECT', src: '//sdk.51.la/js-sdk-pro.min.js?id=3JzdjakNrCyaUiKx&ck=3JzdjakNrCyaUiKx' }]
  ],
  cleanUrls: true,
  sitemap: {
    hostname: 'https://www.zhoujump.club',
  }
})
