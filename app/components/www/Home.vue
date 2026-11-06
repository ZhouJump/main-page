<script setup lang="ts">
const { isEn } = useLang()

useSeoMeta({
  title: () => (isEn.value ? 'zhoujump · Frontend Developer' : 'zhoujump · 前端开发工程师'),
  description: () =>
    isEn.value
      ? 'Frontend engineering, full-stack development and product delivery. Vue / Nuxt / TypeScript / Node.js — turning ideas into working products.'
      : '前端工程、全栈开发与产品实现。Vue / Nuxt / TypeScript / Node.js，专注于把想法做成可用的产品。'
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            name: '周楚杰',
            alternateName: 'zhoujump',
            jobTitle: isEn.value ? 'Frontend Developer' : '前端开发工程师',
            url: 'https://www.zhoujump.com/',
            email: 'mailto:x@zhoujump.com',
            address: { '@type': 'PostalAddress', addressLocality: isEn.value ? 'Xiamen' : '厦门', addressCountry: 'CN' },
            sameAs: ['https://github.com/zhoujump', 'https://www.zhoujump.com/blog/']
          },
          {
            '@type': 'WebSite',
            name: 'zhoujump',
            url: 'https://www.zhoujump.com/',
            inLanguage: isEn.value ? 'en' : 'zh-CN'
          }
        ]
      })
    }
  ]
}))
</script>

<template>
  <div class="overflow-x-clip">
    <WwwHeroSection />
    <WwwStackSection />
    <WwwBuildersSection />
    <WwwDbSection />
    <WwwBuiltSection />
    <WwwSecuritySection />
    <WwwCtaSection />
  </div>
</template>
