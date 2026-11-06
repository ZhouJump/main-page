<script setup lang="ts">
import { projects } from '~/data/projects'

const { isEn, wwwPrefix } = useLang()

useSeoMeta({
  title: () => (isEn.value ? 'Projects · zhoujump' : '项目 · zhoujump'),
  description: () =>
    isEn.value
      ? 'The complete list of six projects: Mango Form, Canvas Web, Starify, NoteFlow, Resume Editor, and Campus Mobile.'
      : '六个项目的完整清单：芒果表单、Canvas Web、星光跨境营销、NoteFlow、简历编辑器与掌上莆院。'
})

const showcase = projects.filter((project) => ['mangofairvisa', 'canvas-web', 'starify', 'noteflow'].includes(project.slug))
const layouts = ['overlay', 'split', 'reverse', 'offset'] as const
const resume = projects.find((project) => project.slug === 'resume-tool')!
const campus = projects.find((project) => project.slug === 'zhangshang-puyuan')!
</script>

<template>
  <div class="overflow-x-clip">
    <WwwHeroBars />


    <div class="pt-6">
      <WwwDivider />
    </div>

    <section id="project-list" class="www-container space-y-20 py-20 lg:space-y-28">
      <div v-for="(project, index) in showcase" :key="project.slug" data-reveal>
        <WwwProjectPanel :project="project" :layout="layouts[index] ?? 'split'" />
      </div>

      <!-- resume editor -->
      <section data-reveal class="border-t border-paper/10 pt-8">
        <a :href="resume.links[0]?.href" class="group grid items-center gap-8 md:grid-cols-[1fr_14rem]">
          <div>
            <div class="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-muted">
              <span class="text-brand-500">{{ resume.index }}</span>
              <span>{{ resume.year }}</span>
              <span>{{ isEn ? resume.en.role : resume.role }}</span>
            </div>
            <h3 class="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-medium tracking-[-0.03em] transition group-hover:text-brand-500">
              {{ resume.title }}
            </h3>
            <p class="www-body mt-4 max-w-xl">{{ isEn ? resume.en.summary : resume.summary }}</p>
            <span class="mt-6 inline-flex font-mono text-[10px] tracking-[0.18em] text-paper">{{ isEn ? 'Read article' : '读文章' }} ↗</span>
          </div>
          <AssetFrame label="RESUME" hint="BLOG ARTICLE" ratio="4 / 3" />
        </a>
      </section>

      <!-- campus -->
      <section data-reveal class="relative overflow-hidden border border-paper/15 p-6 lg:p-10">
        <span class="pointer-events-none absolute right-4 top-0 font-display text-[24vw] leading-none font-semibold text-paper/5 lg:text-[12vw]">
          {{ campus.index }}
        </span>
        <div class="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <p class="font-mono text-[10px] tracking-[0.24em] text-brand-500">{{ campus.cn }} · {{ campus.year }}</p>
            <h3 class="mt-4 font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[0.94] font-medium tracking-[-0.035em]">
              {{ campus.title }}
            </h3>
            <p class="www-body mt-5 max-w-lg">{{ isEn ? campus.en.summary : campus.summary }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <span v-for="item in isEn ? campus.en.stack : campus.stack" :key="item" class="border border-paper/15 px-2.5 py-1.5 font-mono text-[10px] text-muted">
                {{ item }}
              </span>
            </div>
            <div class="mt-8">
              <WwwCta :to="campus.detail ? wwwPrefix + campus.detail : undefined" :label="isEn ? 'Details' : '项目详情'" variant="ghost" />
            </div>
          </div>
          <AssetFrame :label="campus.title" hint="MOBILE / 4:5" ratio="4 / 5" />
        </div>
      </section>
    </section>

    <section class="bg-paper text-ink-950">
      <div class="www-container flex flex-wrap items-center justify-between gap-8 py-16 lg:py-20">
        <div>
          <p class="font-mono text-[10px] tracking-[0.24em] text-brand-600">COLLABORATION</p>
          <h2 class="www-h2 mt-4 text-[clamp(2rem,4.4vw,4rem)] text-ink-950">{{ isEn ? 'Want to talk about a project?' : '想聊聊某个项目？' }}</h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <WwwCta href="mailto:x@zhoujump.com" :label="isEn ? 'Email me' : '发邮件'" variant="black" />
          <WwwCta :to="wwwPrefix + '/about'" :label="isEn ? 'About me' : '关于我'" variant="blue" />
        </div>
      </div>
    </section>
  </div>
</template>
