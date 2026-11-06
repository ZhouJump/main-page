export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],
  css: ['~/assets/css/main.css', '~/assets/css/reference.css'],
  ui: {
    fonts: false
  },
  devtools: { enabled: true },
  compatibilityDate: '2026-11-03',
  app: {
    pageTransition: { name: 'page-curtain', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0B0D10' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.bunny.net', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.bunny.net/css?family=inter-tight:400,500,600,700|inter:400,500,600|jetbrains-mono:400,500|noto-sans-sc:400,500,700'
        }
      ]
    }
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? '',
    adminUsername: process.env.ADMIN_USERNAME ?? '',
    adminPassword: process.env.ADMIN_PASSWORD ?? '',
    uploadDir: process.env.UPLOAD_DIR ?? './data/uploads',
    session: {
      name: 'zhoujump-admin-session',
      cookie: {
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7
      }
    },
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      siteWwwUrl: process.env.SITE_WWW_URL ?? 'https://www.zhoujump.com',
      siteBlogUrl: process.env.SITE_BLOG_URL ?? 'https://blog.zhoujump.com'
    }
  },
  routeRules: {
    '/api/**': { cors: false }
  },
  vite: {
    server: {
      allowedHosts: ['www.zhoujump.com', 'blog.zhoujump.com', '.localhost']
    }
  }
})
