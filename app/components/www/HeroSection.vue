<script setup lang="ts">
import HeroCanvas from './HeroCanvas.vue'

const { isEn, wwwPrefix } = useLang()
</script>

<template>
  <section id="hero-home" class="home-hero">
    <HeroCanvas />
    <div class="canvas-overlay home-hero" />
    <div class="padding-global z-index-2">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-vflex home-hero_layout">
          <div class="w-layout-vflex gap-40 vx-center">
            <div class="w-layout-vflex gap-24 vx-center mob_gap-140">
              <div class="tablet_mw-500 hide-mob">
                <h1 class="h1-81px text-center mob_56px">
                  <span class="hero-line-mask"><span data-hero-line>{{ isEn ? 'Turn ideas' : '把想法' }}</span></span>
                  <span class="hero-line-mask"><span data-hero-line>{{ isEn ? 'into products' : '做成产品' }}</span></span>
                </h1>
              </div>
              <div class="only-mob">
                <h1 class="h1-81px text-center mob_56px">
                  <span class="hero-line-mask"><span data-hero-line>{{ isEn ? 'Turn ideas' : '把想法' }}</span></span>
                  <span class="hero-line-mask"><span data-hero-line>{{ isEn ? 'into products' : '做成产品' }}</span></span>
                </h1>
              </div>
              <div class="mob_mw-320">
                <p class="ts-18px text-center mob_16px fw-medium" data-hero>{{ isEn ? 'Design, develop, deliver. The complete workflow of a frontend engineer.' : '设计、开发、交付。一个前端工程师的完整工作流。' }}</p>
              </div>
            </div>
            <div class="w-layout-hflex gap-8 mob_gap-4" data-hero>
              <NuxtLink global="textStagger" :to="`${wwwPrefix}/project`" class="cta-button is--blue">
                <span global-target>{{ isEn ? 'View projects' : '查看项目' }}</span>
              </NuxtLink>
              <NuxtLink global="textStagger" :to="`${wwwPrefix}/about`" class="cta-button">
                <span global-target>{{ isEn ? 'About me' : '关于我' }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
