<script setup lang="ts">
const { isEn, wwwPrefix } = useLang()
</script>

<template>
  <section class="home-security">
    <div class="padding-global">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-grid home-security_grid">
          <div class="home-security_first-grid">
            <div class="w-layout-vflex gap-40 mob_gap-32">
              <h2 data-reveal class="h2-81px color-black">{{ isEn ? 'Reliability' : '可靠，' }}<br />{{ isEn ? 'can be verified' : '是可以被验证的' }}</h2>
              <div class="mw-400">
                <p class="ts-18px color-black-50 mob_16px">{{ isEn ? 'Type checks, accessibility, performance budgets, real-device regression. Quality is not a promise — it is a process that runs to completion before every delivery.' : '类型检查、可访问性、性能预算、真实设备回归。品质不是承诺，而是每次交付前都会跑完的流程。' }}</p>
              </div>
            </div>
            <div class="w-layout-hflex gap-8 mob_gap-4">
              <NuxtLink global="textStagger" :to="`${wwwPrefix}/project`" class="cta-button is--blue">
                <span global-target>{{ isEn ? 'View projects' : '查看项目' }}</span>
              </NuxtLink>
              <NuxtLink global="textStagger" :to="`${wwwPrefix}/about`" class="cta-button is--black">
                <span global-target>{{ isEn ? 'Engineering principles' : '工程原则' }}</span>
              </NuxtLink>
            </div>
          </div>

          <div class="home-security_second-grid">
            <div class="home-security_img-wrapper">
              <div class="object-cover"><WwwLottiePlayer src="/lottie/security.json" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
