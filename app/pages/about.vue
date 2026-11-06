<script setup lang="ts">
import { projects } from '~/data/projects'

const { isEn, wwwPrefix } = useLang()

useSeoMeta({
  title: () => (isEn.value ? 'About · Chujie Zhou' : '关于 · 周楚杰'),
  description: () =>
    isEn.value
      ? 'Frontend developer based in Xiamen. Vue / Nuxt / TypeScript / Node.js. Experience, skills, and contact.'
      : '前端开发工程师，厦门。Vue / Nuxt / TypeScript / Node.js。履历、技能与联系方式。'
})

const skillsZh = [
  { title: '熟练', items: ['Vue 3', 'Nuxt', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Tailwind CSS'] },
  { title: '熟悉', items: ['Node.js', 'Prisma', 'PostgreSQL', 'Vite', 'GSAP', 'uni-app', 'uniCloud'] },
  { title: '了解', items: ['Docker', 'Nginx', 'Redis', 'Python', 'Go', 'Figma'] }
]
const skillsEn = [
  { title: 'Proficient', items: ['Vue 3', 'Nuxt', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Tailwind CSS'] },
  { title: 'Familiar', items: ['Node.js', 'Prisma', 'PostgreSQL', 'Vite', 'GSAP', 'uni-app', 'uniCloud'] },
  { title: 'Exposure', items: ['Docker', 'Nginx', 'Redis', 'Python', 'Go', 'Figma'] }
]
const skills = computed(() => (isEn.value ? skillsEn : skillsZh))

const timelineZh = [
  {
    company: '厦门聚页',
    role: '前端开发工程师',
    period: '2024 — NOW',
    points: [
      '负责芒果表单与 Canvas Web 的前端开发，参与展会预登记、AI 资格审核与工作流编排等核心模块。',
      '用 Vue 与组件级权限搭建可配置表单与后台界面，推动设计系统与页面生成流程。'
    ]
  },
  {
    company: '国投智能',
    role: '前端开发实习',
    period: '2023',
    points: ['参与业务系统前端开发，负责页面还原、组件拆解与接口联调。']
  },
  {
    company: '厦门独众',
    role: '前端开发实习',
    period: '2022',
    points: ['参与移动端与网页端项目，完成页面开发与基础交互实现。']
  }
]
const timelineEn = [
  {
    company: 'Xiamen Juye',
    role: 'Frontend Developer',
    period: '2024 — NOW',
    points: [
      'Frontend development for Mango Form and Canvas Web, covering core modules such as expo pre-registration, AI eligibility review, and workflow orchestration.',
      'Built configurable forms and admin interfaces with Vue and component-level permissions, driving the design system and page generation pipeline.'
    ]
  },
  {
    company: 'Guotou Intelligence',
    role: 'Frontend Developer Intern',
    period: '2023',
    points: ['Worked on business system frontend: page implementation, component breakdown, and API integration.']
  },
  {
    company: 'Xiamen Duzhong',
    role: 'Frontend Developer Intern',
    period: '2022',
    points: ['Contributed to mobile and web projects, delivering pages and basic interactions.']
  }
]
const timeline = computed(() => (isEn.value ? timelineEn : timelineZh))

const awardsZh = ['莆田学院 · 宣传部部长', '微拍大赛获奖', '文创比赛获奖']
const awardsEn = ['Putian University · Head of Publicity Department', 'Micro-photography Contest Award', 'Cultural & Creative Contest Award']
const awards = computed(() => (isEn.value ? awardsEn : awardsZh))
</script>

<template>
  <div class="overflow-x-clip">
    <!-- hero -->
    <WwwHeroTicks />

    <div class="pt-6">
      <WwwDivider />
    </div>

    <!-- statement on cream -->
    <section class="bg-paper text-ink-950">
      <div class="www-container py-20 lg:py-28">
        <p data-reveal class="font-mono text-[10px] tracking-[0.24em] text-brand-600">STATEMENT</p>
        <p data-reveal class="mt-7 max-w-5xl font-display text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.02] font-medium tracking-[-0.03em]">
          {{ isEn ? '“Translate requirements into usable interfaces, then polish those interfaces into systems that can be maintained for the long term.”' : '“把需求翻译成可用的界面，再把界面打磨成能长期维护的系统。”' }}
        </p>
        <div data-reveal class="mt-10 grid gap-6 border-t border-ink-950/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="font-mono text-[10px] tracking-[0.2em] text-ink-950/50">LOCATION</p>
            <p class="mt-2 text-sm">{{ isEn ? 'Xiamen · Fujian' : '厦门 · 福建' }}</p>
          </div>
          <div>
            <p class="font-mono text-[10px] tracking-[0.2em] text-ink-950/50">EXPERIENCE</p>
            <p class="mt-2 text-sm">{{ isEn ? '2+ years in frontend' : '2 年+ 前端开发' }}</p>
          </div>
          <div>
            <p class="font-mono text-[10px] tracking-[0.2em] text-ink-950/50">EMAIL</p>
            <a href="mailto:x@zhoujump.com" class="mt-2 block text-sm transition hover:text-brand-600">x@zhoujump.com</a>
          </div>
          <div>
            <p class="font-mono text-[10px] tracking-[0.2em] text-ink-950/50">GITHUB</p>
            <a href="https://github.com/zhoujump" target="_blank" rel="noopener" class="mt-2 block text-sm transition hover:text-brand-600">
              github.com/zhoujump
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- experience -->
    <section class="www-container py-20 lg:py-28">
      <div data-reveal class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="www-eyebrow">EXPERIENCE</p>
          <h2 class="www-h2 mt-5 text-[clamp(2.2rem,4.4vw,4rem)]" v-html="isEn ? 'Work<br />History.' : '工作<br />经历.'"></h2>
        </div>
        <p class="max-w-xs text-sm text-muted">{{ isEn ? 'From campus projects to expo products, it has always been the same craft.' : '从校园项目到展会产品，一直在做同一件事。' }}</p>
      </div>

      <div class="mt-12 border-t border-paper/10">
        <div
          v-for="item in timeline"
          :key="item.company"
          data-reveal
          class="grid gap-6 border-b border-paper/10 py-10 md:grid-cols-12"
        >
          <div class="md:col-span-3">
            <p class="font-mono text-[10px] tracking-[0.2em] text-muted">{{ item.period }}</p>
          </div>
          <div class="md:col-span-4">
            <p class="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium tracking-[-0.02em]">{{ item.company }}</p>
            <p class="mt-2 font-mono text-[10px] tracking-[0.18em] text-brand-500">{{ item.role }}</p>
          </div>
          <ul class="space-y-2 md:col-span-5">
            <li v-for="point in item.points" :key="point" class="flex gap-3 text-sm leading-7 text-muted">
              <span class="mt-1 text-brand-500">+</span>{{ point }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- skills -->
    <section class="border-y border-paper/10">
      <div class="www-container py-20 lg:py-28">
        <div data-reveal class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="www-eyebrow">SKILLS</p>
            <h2 class="www-h2 mt-5 text-[clamp(2.2rem,4.4vw,4rem)]" v-html="isEn ? 'Skill<br />Matrix.' : '技能<br />矩阵.'"></h2>
          </div>
          <DotDivider class="hidden w-48 lg:flex" />
        </div>

        <!-- adjacent borders collapse: later cells drop the shared edge -->
        <div class="mt-12 grid md:grid-cols-3">
          <div
            v-for="(group, index) in skills"
            :key="group.title"
            data-reveal
            class="border border-paper/10 p-6 lg:p-8"
            :class="{ 'border-t-0 md:border-t md:border-l-0': index > 0 }"
          >
            <p class="font-display text-2xl font-medium">{{ group.title }}</p>
            <div class="mt-5 h-px bg-paper/10" />
            <ul class="mt-5 flex flex-wrap gap-2">
              <li v-for="item in group.items" :key="item" class="border border-paper/15 px-2.5 py-1.5 font-mono text-[10px] text-muted">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- selected projects -->
    <section class="www-container py-20 lg:py-28">
      <div data-reveal class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p class="www-eyebrow">SELECTED</p>
          <h2 class="www-h2 mt-5 text-[clamp(2.2rem,4.4vw,4rem)]" v-html="isEn ? 'Selected<br />Projects.' : '精选<br />项目.'"></h2>
        </div>
        <NuxtLink :to="wwwPrefix + '/project'" class="font-mono text-[10px] tracking-[0.18em] text-muted transition hover:text-paper">{{ isEn ? 'All projects' : '全部项目' }} →</NuxtLink>
      </div>

      <div class="mt-12 border-t border-paper/10">
        <component
          :is="project.detail && !project.detail.startsWith('http') ? 'NuxtLink' : 'a'"
          v-for="project in projects"
          :key="project.slug"
          :to="project.detail && !project.detail.startsWith('http') ? wwwPrefix + project.detail : undefined"
          :href="project.detail && project.detail.startsWith('http') ? project.detail : undefined"
          class="group grid gap-3 border-b border-paper/10 px-2 py-6 transition hover:bg-brand-500 md:grid-cols-[3rem_1fr_auto] md:items-center md:gap-6"
        >
          <span class="font-mono text-[10px] text-brand-500 group-hover:text-white">{{ project.index }}</span>
          <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span class="font-display text-xl font-medium tracking-[-0.02em] transition group-hover:text-white lg:text-2xl">{{ project.title }}</span>
            <span class="font-mono text-[10px] text-muted group-hover:text-white">{{ project.cn }}</span>
          </div>
          <span class="font-mono text-[10px] text-muted group-hover:text-white">{{ project.year }}</span>
        </component>
      </div>
    </section>

    <!-- education -->
    <section class="border-y border-paper/10 bg-ink-900">
      <div class="www-container grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div data-reveal>
          <p class="www-eyebrow">EDUCATION</p>
          <h2 class="www-h2 mt-5 text-[clamp(2rem,3.6vw,3.2rem)]" v-html="isEn ? 'Education.' : '教育<br />经历.'"></h2>
          <div class="mt-8 border-t border-paper/10 pt-6">
            <p class="font-display text-2xl font-medium">{{ isEn ? 'Putian University' : '莆田学院' }}</p>
            <p class="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted">{{ isEn ? "Bachelor's · 2020 — 2024" : '本科 · 2020 — 2024' }}</p>
            <p class="mt-4 max-w-md text-sm leading-7 text-muted">{{ isEn ? 'Served as head of the publicity department, in charge of club promotion and visual materials; won awards in micro-photography and cultural & creative contests.' : '在校期间担任宣传部部长，负责社团宣传与视觉物料；参与微拍与文创比赛并获奖。' }}</p>
          </div>
        </div>

        <div data-reveal>
          <p class="www-eyebrow">HONORS</p>
          <h2 class="www-h2 mt-5 text-[clamp(2rem,3.6vw,3.2rem)]" v-html="isEn ? 'Honors &<br />Awards.' : '奖项与<br />经历.'"></h2>
          <ul class="mt-8 divide-y divide-paper/10 border-y border-paper/10">
            <li v-for="award in awards" :key="award" class="flex items-center justify-between py-4 text-sm">
              <span>{{ award }}</span>
              <span class="text-brand-500">+</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- resume -->
    <section class="bg-paper text-ink-950">
      <div class="www-container flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div>
          <p class="font-mono text-[10px] tracking-[0.24em] text-brand-600">RESUME</p>
          <p class="www-h2 mt-4 text-[clamp(2rem,4vw,3.6rem)] text-ink-950" v-html="isEn ? 'Download the full resume,<br />or reach out directly.' : '下载完整简历，<br />或直接联系我。'"></p>
        </div>
        <div class="flex flex-wrap gap-3">
          <WwwCta href="/resume.pdf" :label="isEn ? 'Download PDF' : '下载 PDF'" variant="black" />
          <WwwCta href="https://www.zhoujump.com/blog/p/resume-tool-index/" :label="isEn ? 'Resume editor' : '简历编辑器'" variant="blue" />
          <WwwCta href="mailto:x@zhoujump.com" label="x@zhoujump.com" variant="black" />
        </div>
      </div>
    </section>
  </div>
</template>
