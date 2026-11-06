<script setup lang="ts">
import type { ProjectDetailContent } from '~/data/projectDetails'

const props = defineProps<{ content: ProjectDetailContent }>()

const { isEn, wwwPrefix } = useLang()

const tagline = computed(() => (isEn.value ? props.content.project.en.tagline : props.content.project.tagline))
const role = computed(() => (isEn.value ? props.content.project.en.role : props.content.project.role))
const links = computed(() => {
  const project = props.content.project
  if (!isEn.value) return project.links
  return project.links.map((link, index) => ({
    ...link,
    label: project.en.links[index]?.label ?? link.label,
    note: project.en.links[index]?.note ?? link.note
  }))
})
const primary = computed(() => links.value[0])
const secondary = computed(() => links.value[1])
const nextTo = computed(() => {
  const detail = props.content.next.detail
  if (!detail) return undefined
  return detail.startsWith('http') ? detail : wwwPrefix.value + detail
})
</script>

<template>
  <div class="overflow-x-clip">
    <WwwHeroToken
      :title="`${content.heroTitle[0]}${content.heroTitle[1]}`"
      :subtitle="tagline"
    />

    <!-- meta -->
    <section class="www-container pb-14 pt-4">
      <div class="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] text-muted">
        <NuxtLink :to="wwwPrefix + '/project'" class="transition hover:text-paper">{{ isEn ? '← All projects' : '← 全部项目' }}</NuxtLink>
        <span>{{ content.project.index }} / {{ content.project.year }} · {{ role }}</span>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <template v-if="primary">
          <WwwCta v-if="primary.href" :href="primary.href" :label="primary.label" variant="white" />
          <span v-else class="www-btn www-btn--ghost cursor-not-allowed opacity-50">
            {{ primary.label }} · {{ primary.note }}
          </span>
        </template>

        <template v-if="secondary">
          <WwwCta v-if="secondary.href" :href="secondary.href" :label="secondary.label" variant="ghost" />
          <span v-else class="www-btn www-btn--ghost cursor-not-allowed opacity-50">
            {{ secondary.label }} · {{ secondary.note }}
          </span>
        </template>
      </div>
    </section>

    <div class="pt-6">
      <WwwDivider />
    </div>

    <!-- background -->
    <section class="www-container py-20 lg:py-28">
      <div data-reveal class="grid gap-8 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <p class="www-eyebrow">CONTEXT</p>
          <h2 class="www-h2 mt-5 text-[clamp(2.2rem,4.4vw,4rem)]" v-html="isEn ? 'Project<br />Background.' : '业务<br />背景.'"></h2>
        </div>
        <p class="www-body lg:col-span-8">{{ content.backgroundIntro }}</p>
      </div>

      <div class="mt-12 grid gap-px border border-paper/10 bg-paper/10 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="(block, index) in content.background" :key="block.title" data-reveal class="bg-ink-950 p-6 lg:p-8">
          <p class="font-mono text-[10px] tracking-[0.2em] text-brand-500">{{ String(index + 1).padStart(2, '0') }}</p>
          <p class="mt-5 font-display text-[1.35rem] leading-tight font-medium">{{ block.title }}</p>
          <p class="mt-3 text-sm leading-6 text-muted">{{ block.desc }}</p>
        </div>
      </div>
    </section>

    <!-- features -->
    <section class="border-y border-paper/10 bg-ink-900">
      <div class="www-container py-20 lg:py-28">
        <div data-reveal class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="www-eyebrow">CAPABILITIES</p>
            <h2 class="www-h2 mt-5 text-[clamp(2.2rem,4.4vw,4rem)]" v-html="isEn ? 'Key<br />Features.' : '功能与<br />实现.'"></h2>
          </div>
          <DotDivider class="hidden w-48 lg:flex" />
        </div>

        <div class="mt-14 space-y-16 lg:space-y-24">
          <div
            v-for="(feature, index) in content.features"
            :key="feature.title"
            data-reveal
            class="grid items-center gap-8 lg:gap-14"
            :class="index === 1 ? '' : 'lg:grid-cols-2'"
          >
            <template v-if="index === 1">
              <div class="relative">
                <AssetFrame :label="content.gallery[1] ?? feature.title" :hint="feature.label" ratio="21 / 9" />
                <div class="mt-6 grid gap-6 border border-paper/10 bg-ink-950 p-6 md:grid-cols-[1fr_1.2fr] lg:p-8">
                  <div>
                    <p class="font-mono text-[10px] tracking-[0.2em] text-brand-500">{{ feature.label }}</p>
                    <h3 class="www-h3 mt-3 text-[clamp(1.7rem,2.6vw,2.4rem)]">{{ feature.title }}</h3>
                  </div>
                  <div>
                    <p class="www-body text-sm">{{ feature.body }}</p>
                    <ul class="mt-4 flex flex-wrap gap-2">
                      <li v-for="point in feature.points" :key="point" class="border border-paper/15 px-2.5 py-1.5 font-mono text-[10px] text-muted">
                        {{ point }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div :class="index === 2 ? 'lg:order-2' : ''">
                <p class="font-mono text-[10px] tracking-[0.2em] text-brand-500">{{ feature.label }}</p>
                <h3 class="www-h3 mt-3 text-[clamp(1.7rem,2.6vw,2.4rem)]">{{ feature.title }}</h3>
                <p class="www-body mt-4">{{ feature.body }}</p>
                <ul class="mt-5 space-y-2">
                  <li v-for="point in feature.points" :key="point" class="flex items-start gap-3 text-sm text-muted">
                    <span class="mt-1 text-brand-500">+</span>{{ point }}
                  </li>
                </ul>
              </div>
              <div :class="index === 2 ? 'lg:order-1' : ''">
                <AssetFrame :label="content.gallery[index] ?? feature.title" :hint="feature.label" ratio="4 / 3" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- matrix -->
    <section v-if="content.matrix" class="www-container py-20 lg:py-28">
      <div data-reveal class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="www-eyebrow">ARCHITECTURE</p>
          <h2 class="www-h2 mt-5 text-[clamp(2.2rem,4.4vw,4rem)]" v-html="isEn ? 'Permission<br />Matrix.' : '权限<br />矩阵.'"></h2>
        </div>
        <p class="max-w-xs text-sm text-muted">{{ isEn ? 'Component-level permissions and department boundaries, down to every operation.' : '组件级权限与部门边界，落到每一个操作上。' }}</p>
      </div>

      <div class="mt-10 overflow-x-auto border border-paper/15">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead class="border-b border-paper/10 font-mono text-[10px] tracking-[0.16em] text-muted">
            <tr>
              <th v-for="column in content.matrix.columns" :key="column" class="px-4 py-3">{{ column }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-paper/10">
            <tr v-for="row in content.matrix.rows" :key="row[0]">
              <td v-for="(cell, index) in row" :key="index" class="px-4 py-3" :class="cell === '✓' ? 'text-brand-500' : 'text-muted'">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- gallery -->
    <section class="www-container pb-20 lg:pb-28">
      <div data-reveal class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="www-eyebrow">GALLERY</p>
          <h2 class="www-h2 mt-5 text-[clamp(2.2rem,4.4vw,4rem)]" v-html="isEn ? 'Product<br />Gallery.' : '产品<br />画廊.'"></h2>
        </div>
        <p class="max-w-xs text-sm text-muted">{{ isEn ? 'Placeholders for screenshots, ready to be swapped with real product UI.' : '截图位置预留，可替换为真实产品界面。' }}</p>
      </div>

      <div class="mt-10 grid gap-4 md:grid-cols-2">
        <AssetFrame :label="content.gallery[0] ?? 'SCREEN'" ratio="16 / 10" class="md:row-span-2" />
        <AssetFrame :label="content.gallery[1] ?? 'SCREEN'" ratio="16 / 10" />
        <AssetFrame :label="content.gallery[2] ?? 'SCREEN'" ratio="16 / 10" />
      </div>
    </section>

    <!-- next -->
    <section class="bg-paper text-ink-950">
      <div class="www-container flex flex-wrap items-center justify-between gap-8 py-16 lg:py-20">
        <div>
          <p class="font-mono text-[10px] tracking-[0.24em] text-brand-600">NEXT PROJECT</p>
          <NuxtLink v-if="content.next.detail" :to="nextTo" class="group mt-4 inline-flex items-baseline gap-4">
            <span class="font-display text-[clamp(1.9rem,4vw,3.6rem)] font-medium tracking-[-0.03em] transition group-hover:text-brand-600">
              {{ content.next.title }}
            </span>
            <span class="font-mono text-[10px] text-ink-950/50">{{ content.next.cn }} ↗</span>
          </NuxtLink>
          <a v-else :href="content.next.links[0]?.href" class="font-display text-[clamp(1.9rem,4vw,3.6rem)] font-medium tracking-[-0.03em]">
            {{ content.next.title }} ↗
          </a>
        </div>

        <WwwCta :to="wwwPrefix + '/project'" :label="isEn ? 'Back to all projects' : '返回项目总览'" variant="black" />
      </div>
    </section>
  </div>
</template>
