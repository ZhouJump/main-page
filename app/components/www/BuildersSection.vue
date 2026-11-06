<script setup lang="ts">
const { isEn, wwwPrefix } = useLang()
const { blogUrl, wwwUrl } = useSite()
const arrowPath = 'M13.5059 5.59528L7.92987 11.2099L6.44422 9.66634L9.49269 6.71434H0V4.5534H9.56987L6.44422 1.54353L7.92987 0L13.5059 5.59528Z'

const blogHref = computed(() => (isEn.value ? `${wwwUrl.value}/en/blog/` : blogUrl.value))

const copy = computed(() =>
  isEn.value
    ? {
        buildTitle: 'Build products',
        buildItems: [
          'From design systems to component libraries — a reusable engineering foundation.',
          'Complex interactions and performance problems get handled, leaving a clear product experience.',
          'You focus on the product; I keep it running reliably.'
        ],
        buildCta: 'Browse the project archive',
        writeTitle: 'Write content',
        writeItems: [
          'Writing down the decisions I made, and why.',
          'A long-term record of performance, accessibility, and engineering trade-offs.',
          'No chasing trends — only conclusions worth reusing.'
        ],
        writeCta: 'Read the articles'
      }
    : {
        buildTitle: '做产品',
        buildItems: [
          '从设计系统到组件库，一套可复用的工程底座。',
          '把复杂的交互和性能问题处理掉，只留下清晰的产品体验。',
          '你专注产品，我负责让它稳稳跑起来。'
        ],
        buildCta: '查看项目档案',
        writeTitle: '写内容',
        writeItems: [
          '写下做过的决定，以及为什么这样做。',
          '关于性能、可访问性与工程取舍的长期记录。',
          '不追热点，只留下能复用的结论。'
        ],
        writeCta: '阅读文章'
      }
)
</script>

<template>
  <section id="home-builders" class="home-builders">
    <WwwDivider position="top" />

    <div class="padding-global">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-vflex home-builders_layout">
          <div class="w-layout-grid home-builders_grid">
            <div class="home-builders_grid-item">
              <div class="w-layout-hflex home-builders_heading-wrapper">
                <h2 data-reveal class="h2-48px mob_39px">{{ copy.buildTitle }}</h2>
                <div class="home-builders_img-wrapper">
                  <div class="home-builders_lottie builders"><WwwLottiePlayer src="/lottie/builders.json" /></div>
                </div>
              </div>

              <div class="w-layout-vflex gap-8">
                <div class="w-layout-vflex gap-4 full-width">
                  <div class="w-layout-hflex home-builders_content-item">
                    <div class="w-layout-hflex gap-16">
                      <div class="cube-14" />
                      <div><p class="ts-18px mob_16px">{{ copy.buildItems[0] }}</p></div>
                    </div>
                  </div>
                  <div class="w-layout-hflex home-builders_content-item">
                    <div class="w-layout-hflex gap-16">
                      <div class="cube-14" />
                      <div class="mw-470"><p class="ts-18px mob_16px">{{ copy.buildItems[1] }}</p></div>
                    </div>
                  </div>
                  <div class="w-layout-hflex home-builders_content-item">
                    <div class="w-layout-hflex gap-16">
                      <div class="cube-14" />
                      <div><p class="ts-18px mob_16px">{{ copy.buildItems[2] }}</p></div>
                    </div>
                  </div>
                </div>

                <NuxtLink global="textStagger" :to="`${wwwPrefix}/project`" class="cta-button_wide w-inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 12" fill="none" class="cta-button_wide-arrow-block">
                    <path :d="arrowPath" fill="currentColor" />
                  </svg>
                  <div class="w-layout-hflex cta-button_wide-content-block">
                    <span global-target>{{ copy.buildCta }}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 12" fill="none" class="cta-button_wide-arrow-block">
                    <path :d="arrowPath" fill="currentColor" />
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <div class="home-builders_grid-item">
              <div class="w-layout-hflex home-builders_heading-wrapper">
                <h2 data-reveal class="h2-48px mob_39px">{{ copy.writeTitle }}</h2>
                <div class="home-builders_img-wrapper">
                  <div class="home-builders_lottie builders"><WwwLottiePlayer src="/lottie/traders.json" /></div>
                </div>
              </div>

              <div class="w-layout-vflex gap-8">
                <div class="w-layout-vflex gap-4 full-width">
                  <div class="w-layout-hflex home-builders_content-item">
                    <div class="w-layout-hflex gap-16">
                      <div class="cube-14" />
                      <div class="mw-500"><p class="ts-18px mob_16px">{{ copy.writeItems[0] }}</p></div>
                    </div>
                  </div>
                  <div class="w-layout-hflex home-builders_content-item">
                    <div class="w-layout-hflex gap-16">
                      <div class="cube-14" />
                      <div><p class="ts-18px mob_16px">{{ copy.writeItems[1] }}</p></div>
                    </div>
                  </div>
                  <div class="w-layout-hflex home-builders_content-item">
                    <div class="w-layout-hflex gap-16">
                      <div class="cube-14" />
                      <div class="mw-470"><p class="ts-18px mob_16px">{{ copy.writeItems[2] }}</p></div>
                    </div>
                  </div>
                </div>

                <a :href="blogHref" global="textStagger" class="cta-button_wide w-inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 12" fill="none" class="cta-button_wide-arrow-block">
                    <path :d="arrowPath" fill="currentColor" />
                  </svg>
                  <div class="w-layout-hflex cta-button_wide-content-block">
                    <span global-target>{{ copy.writeCta }}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 12" fill="none" class="cta-button_wide-arrow-block">
                    <path :d="arrowPath" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
