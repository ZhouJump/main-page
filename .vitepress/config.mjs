import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "粥粥技术记录",
  description: "个人技术与项目记录展示站",
  cleanUrls: true,
  sitemap: {
    hostname: 'https://www.zhoujump.club',
  }
})
