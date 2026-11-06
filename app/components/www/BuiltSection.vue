<script setup lang="ts">
const { isEn, wwwPrefix } = useLang()

const stats = computed(() =>
  isEn.value
    ? [
        { number: '12', desc: 'Projects shipped', variant: '' },
        { number: '86', desc: 'Technical articles published', variant: 'is--black' },
        { number: '6', desc: 'Years of continuous delivery', variant: 'is--grey' },
        { number: '100%', desc: 'Responsive & accessible coverage', variant: 'is--white' }
      ]
    : [
        { number: '12', desc: '已上线的项目', variant: '' },
        { number: '86', desc: '发布的技术文章', variant: 'is--black' },
        { number: '6', desc: '年持续交付经验', variant: 'is--grey' },
        { number: '100%', desc: '响应式与可访问性覆盖', variant: 'is--white' }
      ]
)
</script>

<template>
  <section class="home-built">
    <div class="padding-global">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-vflex home-built_layout">
          <div class="w-layout-grid home-built_grid-1">
            <div><span class="ts-16px color-blue">Selected Work</span></div>
            <div class="home-built_second-grid-1">
              <div class="w-layout-vflex gap-40 mob_gap-32">
                <h2 data-reveal class="h2-48px">{{ isEn ? 'Every project is a complete delivery: design, build, ship, then review.' : '把每个项目当作一次完整的交付：设计、实现、上线，然后复盘。' }}</h2>
                <div class="mw-470">
                  <p class="ts-18px color-white-50 mob_16px">{{ isEn ? 'The result is not a pretty screenshot, but something that keeps running, stays maintainable, and keeps evolving.' : '结果不是漂亮的截图，而是能持续运行、能被维护、能被继续迭代的东西。' }}</p>
                </div>
              </div>
              <div class="w-layout-hflex gap-8 mob_gap-4">
                <NuxtLink global="textStagger" :to="`${wwwPrefix}/project`" class="cta-button is--blue">
                  <span global-target>{{ isEn ? 'Browse projects' : '浏览项目' }}</span>
                </NuxtLink>
                <NuxtLink global="textStagger" :to="`${wwwPrefix}/about`" class="cta-button">
                  <span global-target>{{ isEn ? 'My approach' : '了解方法' }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <WwwDivider />

    <div class="global_info-wrapper">
      <div class="w-layout-grid global_info-grid">
        <div v-for="item in stats" :key="item.desc" class="w-layout-vflex global_info-item" :class="item.variant">
          <span class="global_info-number">{{ item.number }}</span>
          <span class="global_info-desc">{{ item.desc }}</span>
          <div class="global_cube-bottom" :class="{ 'is--black': item.variant === 'is--grey' || item.variant === 'is--white' }" />
          <div class="global_cube-top" :class="{ 'is--black': item.variant === 'is--grey' || item.variant === 'is--white' }" />
        </div>
      </div>
    </div>
  </section>
</template>
