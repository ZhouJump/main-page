<script setup lang="ts">
import type { Project } from '~/data/projects'

const props = withDefaults(
  defineProps<{
    project: Project
    layout?: 'overlay' | 'split' | 'reverse' | 'offset'
  }>(),
  {
    layout: 'split'
  }
)

const { isEn, wwwPrefix } = useLang()

const links = computed(() => {
  if (!isEn.value) return props.project.links
  return props.project.links.map((link, index) => ({
    ...link,
    label: props.project.en.links[index]?.label ?? link.label,
    note: props.project.en.links[index]?.note ?? link.note
  }))
})
const external = computed(() => links.value.find((link) => link.href))
const href = computed(() => {
  const detail = props.project.detail
  if (detail) return detail.startsWith('http') ? detail : wwwPrefix.value + detail
  return external.value?.href ?? ''
})
const target = computed(() => (props.project.detail?.startsWith('http') ? '_blank' : undefined))

const tagline = computed(() => (isEn.value ? props.project.en.tagline : props.project.tagline))
const role = computed(() => (isEn.value ? props.project.en.role : props.project.role))
const stack = computed(() => (isEn.value ? props.project.en.stack : props.project.stack))
const summary = computed(() => (isEn.value ? props.project.en.summary : props.project.summary))
const viewLabel = computed(() => (isEn.value ? 'View project' : '查看项目'))
const detailLabel = computed(() => (isEn.value ? 'Details' : '项目详情'))
</script>

<template>
  <article
    class="group relative border-t border-paper/10 pt-6 lg:pt-8"
  >
    <div class="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-muted">
      <span class="flex items-center gap-3">
        <span class="text-brand-500">{{ project.index }}</span>
        <span>{{ project.year }}</span>
        <span class="hidden sm:inline">{{ role }}</span>
      </span>
      <span>{{ project.cn }}</span>
    </div>

    <!-- overlay -->
    <template v-if="layout === 'overlay'">
      <div class="relative mt-5 overflow-hidden">
        <AssetFrame :label="project.title" :hint="project.cn" ratio="16 / 9" rounded />
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div class="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-5 lg:p-8">
          <div class="max-w-2xl">
            <h3 class="font-display text-[clamp(2.1rem,4.4vw,3.9rem)] leading-[0.95] font-medium tracking-[-0.03em]">
              {{ project.title }}
            </h3>
            <p class="mt-3 max-w-lg text-sm leading-6 text-paper/70">{{ tagline }}</p>
          </div>
          <NuxtLink v-if="href" :to="href" :target="target" class="www-btn www-btn--white pointer-events-auto">
            <span class="www-btn__label relative">
              <span>{{ viewLabel }}</span>
              <span aria-hidden="true">{{ viewLabel }}</span>
            </span>
            <svg class="www-btn__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </template>

    <!-- split / reverse -->
    <template v-else-if="layout === 'split' || layout === 'reverse'">
      <div class="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-6" :class="layout === 'reverse' ? 'lg:order-2' : ''">
          <h3 class="font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[0.94] font-medium tracking-[-0.035em]">
            {{ project.title }}
          </h3>
          <p class="www-body mt-5 max-w-lg">{{ summary }}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="item in stack"
              :key="item"
              class="border border-paper/15 px-2.5 py-1.5 font-mono text-[10px] text-muted transition group-hover:border-brand-500/60"
            >
              {{ item }}
            </span>
          </div>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <NuxtLink v-if="href" :to="href" :target="target" class="www-btn www-btn--ghost">
              <span class="www-btn__label relative">
                <span>{{ detailLabel }}</span>
                <span aria-hidden="true">{{ detailLabel }}</span>
              </span>
              <svg class="www-btn__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </NuxtLink>
            <a
              v-if="external"
              :href="external.href"
              target="_blank"
              rel="noopener"
              class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-brand-500"
            >
              {{ external.label }} ↗
            </a>
          </div>
        </div>

        <div class="lg:col-span-6" :class="layout === 'reverse' ? 'lg:order-1' : ''">
          <AssetFrame :label="project.title" :hint="project.cn" ratio="4 / 3" />
        </div>
      </div>
    </template>

    <!-- offset -->
    <template v-else>
      <div class="mt-6 grid gap-6 md:grid-cols-12 md:gap-0">
        <div class="md:col-span-9">
          <AssetFrame :label="project.title" :hint="project.cn" ratio="16 / 10" />
        </div>
        <div class="relative z-10 border border-paper/15 bg-ink-900 p-6 md:col-span-5 md:col-start-8 md:-ml-16 md:mt-24 lg:p-8">
          <span class="www-cube" />
          <h3 class="mt-4 font-display text-[clamp(1.9rem,3vw,2.9rem)] leading-[0.96] font-medium tracking-[-0.03em]">
            {{ project.title }}
          </h3>
          <p class="mt-4 text-sm leading-7 text-muted">{{ summary }}</p>
          <NuxtLink
            v-if="href"
            :to="href"
            :target="target"
            class="mt-6 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-paper transition hover:text-brand-500"
          >
            {{ viewLabel }} <span class="text-brand-500">↗</span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </article>
</template>
