<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    image?: string
  }>(),
  {
    subtitle: '',
    image: 'https://cdn.prod.website-files.com/69e7b04d09112b265e2d47d1/69fb48505d632efede05de45_deep-token-hero.svg'
  }
)
</script>

<template>
  <section class="dt-hero">
    <img :src="image" loading="lazy" alt="" class="dt-hero_img" />
    <div class="padding-global less-padding z-index-5">
      <div class="w-layout-blockcontainer container-1440 w-container">
        <div class="w-layout-vflex dt-hero_layout">
          <div class="w-layout-vflex gap-36 vx-center">
            <div class="mw-1024">
              <h1 class="h1-102px color-off-white text-center mob_40px">{{ title }}</h1>
            </div>
            <p v-if="subtitle" class="ts-18px mob_16px text-center">{{ subtitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
