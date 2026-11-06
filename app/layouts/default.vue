<script setup lang="ts">
const nuxtApp = useNuxtApp()
const route = useRoute()

// the blog shell (sidebar + main padding) must not change while the old page is
// still on screen: it is swapped only once the route curtain fully covers it
const committedPath = ref(route.path)
const isBlog = computed(() => committedPath.value.startsWith('/blog') || committedPath.value.startsWith('/en/blog'))

const commitPath = () => {
  committedPath.value = route.path
}

if (import.meta.client && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('zj:curtain-covered', commitPath)
} else {
  nuxtApp.hook('page:finish', commitPath)
}

const headerNavOpen = ref(false)

const { isEn, wwwPrefix, switchTo } = useLang()

const blogHome = computed(() => (isEn.value ? '/en/blog/' : '/blog/'))

const navItems = computed(() => {
  const path = route.path.replace(/\/+$/, '').replace(/^\/en(?=\/|$)/, '')

  return [
    { label: isEn.value ? 'Home' : '首页', to: `${wwwPrefix.value}/`, active: path === '' },
    { label: isEn.value ? 'Projects' : '项目', to: `${wwwPrefix.value}/project`, active: path.startsWith('/project') },
    { label: isEn.value ? 'About' : '关于', to: `${wwwPrefix.value}/about`, active: path.startsWith('/about') },
    { label: isEn.value ? 'Posts' : '文章', to: blogHome.value, active: isBlog.value }
  ]
})

</script>

<template>
  <div class="flex min-h-screen flex-col bg-ink-950 text-paper">
    <a href="#main-content" class="skip-link">{{ isEn ? 'Skip to content' : '跳到主要内容' }}</a>

    <div class="rb www-shell">
      <header class="navbar">
        <div class="navbar-component">
          <div class="padding-global">
            <div class="container-740 w-container">
              <div class="w-layout-hflex navbar_layout">
                <div class="w-layout-hflex navbar-left">
                  <button
                    type="button"
                    class="navbar-menu-button"
                    :class="{ 'is-open': headerNavOpen }"
                    :aria-expanded="headerNavOpen"
                    :aria-label="headerNavOpen ? '收起菜单' : '展开菜单'"
                    @click="headerNavOpen = !headerNavOpen"
                  >
                    <span class="navbar-menu-button_bar" />
                    <span class="navbar-menu-button_bar" />
                    <span class="navbar-menu-button_bar" />
                  </button>

                  <NuxtLink :to="`${wwwPrefix}/`" class="navbar-logo">
                    zhoujump<span class="navbar-logo-dot">.</span>
                  </NuxtLink>
                </div>

                <div class="w-layout-hflex gap-8 hy-stretch">
                  <nav class="navbar-menu w-nav-menu">
                    <NuxtLink
                      v-for="item in navItems"
                      :key="item.to"
                      :to="item.to"
                      class="navbar_link-block w-inline-block"
                      :class="{ 'is-active': item.active }"
                    >
                      <span global="textStagger">{{ item.label }}</span>
                    </NuxtLink>

                    <a
                      class="navbar_link-block w-inline-block"
                      href="https://www.travellings.cn/go"
                      target="_blank"
                      rel="noopener"
                    >
                      <span global="textStagger">{{ isEn ? 'travellings' : '开往' }}</span>
                    </a>

                    <NuxtLink :to="switchTo" class="navbar_link-block navbar_lang-link w-inline-block">
                      <svg class="navbar_lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18" />
                        <path d="M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9Z" />
                      </svg>
                      <span global="textStagger">{{ isEn ? '中文' : 'EN' }}</span>
                    </NuxtLink>
                  </nav>

                  <a global="textStagger" class="nav_cta-button is--blue" href="mailto:x@zhoujump.com">
                    <span global-target class="mb-0px">{{ isEn ? 'RESUME' : '获取简历' }}</span>
                  </a>
                </div>
              </div>

              <div class="navbar-mobile-panel" :class="{ 'is-open': headerNavOpen }">
                <div class="navbar-mobile-panel_inner">
                  <NuxtLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    class="navbar-mobile-panel_link"
                    :class="{ 'is-active': item.active }"
                    @click="headerNavOpen = false"
                  >
                    {{ item.label }}
                  </NuxtLink>
                  <a
                    class="navbar-mobile-panel_link"
                    href="https://www.travellings.cn/go"
                    target="_blank"
                    rel="noopener"
                    @click="headerNavOpen = false"
                  >
                    {{ isEn ? 'travellings' : '开往' }}
                  </a>
                  <NuxtLink :to="switchTo" class="navbar-mobile-panel_link" @click="headerNavOpen = false">
                    {{ isEn ? '中文' : 'ENGLISH' }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" class="flex-1" :class="{ 'blog-main': isBlog }">
        <BlogSidebar v-if="isBlog" />
        <slot />
      </main>

      <div class="page-meta" :class="{ 'page-meta_blog': isBlog }">
        <div :class="isBlog ? 'www-container' : 'padding-global'">
          <div :class="isBlog ? '' : 'w-layout-blockcontainer container-1440 w-container'">
            <div class="page-meta_inner">
              <div v-if="isBlog" class="page-badges">
                <a href="https://blogscn.fun/" title="BLOGS·CN" target="_blank" rel="noopener">
                  <img src="https://photo.xiangming.site/img/blogscn_icon.png" class="page-badge page-badge_blogs" alt="本站已加入 BLOGS·CN">
                </a>
                <a href="https://www.boyouquan.com/" title="博友圈" target="_blank" rel="noopener">
                  <img src="https://www.boyouquan.com/images/logo/performance-dark.svg?domainName=blog.zhoujump.com" class="page-badge" alt="博友圈">
                </a>
                <a href="https://notbyai.fyi" title="非 AI 生成" target="_blank" rel="noopener">
                  <img src="/not-ai-zh-dark.svg" class="page-badge" alt="非 AI 生成">
                </a>
              </div>

              <div class="page-legal">
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">湘ICP备2025141796号-2</a>
                <a href="https://beian.mps.gov.cn/#/query/webSearch?code=35021102002336" target="_blank" rel="noopener" class="page-legal_mps">
                  <img src="/beian.webp" alt="备案图标" class="page-legal_icon">
                  <span>闽公网安备35021102002336号</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer">
        <div class="padding-global">
          <div class="w-layout-blockcontainer container-1440 w-container">
            <div class="w-layout-grid footer-grid">
              <div class="footer_logo-ilust">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 88 59" fill="none" aria-hidden="true">
                  <path d="M87.1494 32.2275C87.1494 46.7373 75.3867 58.4998 60.877 58.5H0V32.2275H87.1494ZM60.877 0C75.3867 0.000198623 87.1493 11.7627 87.1494 26.2725H0V0H60.877Z" fill="white" />
                </svg>
              </div>

              <div class="w-layout-grid footer_links-grid">
                <div class="w-layout-vflex gap-16">
                  <span class="footer_links-heading">{{ isEn ? 'SITE' : '站点' }}</span>
                  <ul class="footer-list">
                    <li class="footer_list-item"><NuxtLink :to="`${wwwPrefix}/`" class="w-inline-block"><span>{{ isEn ? 'Home' : '首页' }}</span></NuxtLink></li>
                    <li class="footer_list-item"><NuxtLink :to="`${wwwPrefix}/project`" class="w-inline-block"><span>{{ isEn ? 'Projects' : '项目' }}</span></NuxtLink></li>
                    <li class="footer_list-item"><NuxtLink :to="`${wwwPrefix}/about`" class="w-inline-block"><span>{{ isEn ? 'About' : '关于' }}</span></NuxtLink></li>
                  </ul>
                </div>

                <div class="w-layout-vflex gap-16">
                  <span class="footer_links-heading">{{ isEn ? 'WRITING' : '写作' }}</span>
                  <ul class="footer-list">
                    <li class="footer_list-item"><NuxtLink :to="blogHome" class="w-inline-block"><span>{{ isEn ? 'Journal' : '博客' }}</span></NuxtLink></li>
                    <li class="footer_list-item"><a :href="`${isEn ? '/en/blog' : '/blog'}/index.xml`" class="w-inline-block"><span>RSS</span></a></li>
                    <li class="footer_list-item"><a href="/resume.pdf" target="_blank" rel="noopener" class="w-inline-block"><span>{{ isEn ? 'Resume' : '简历' }}</span></a></li>
                  </ul>
                </div>

                <div class="w-layout-vflex gap-16">
                  <span class="footer_links-heading">{{ isEn ? 'CONTACT' : '联系' }}</span>
                  <ul class="footer-list">
                    <li class="footer_list-item"><a href="https://github.com/zhoujump" target="_blank" rel="noopener" class="w-inline-block"><span>GitHub</span></a></li>
                    <li class="footer_list-item"><a href="mailto:x@zhoujump.com" class="w-inline-block"><span>Email</span></a></li>
                    <li class="footer_list-item"><a href="https://x.com" target="_blank" rel="noopener" class="w-inline-block"><span>X / Twitter</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-logo">
          <span class="footer-wordmark">ZHOUJUMP</span>
        </div>
      </footer>
    </div>

  </div>
</template>
