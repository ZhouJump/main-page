export interface ProjectLink {
  label: string
  href?: string
  note?: string
}

export interface ProjectEn {
  tagline: string
  role: string
  stack: string[]
  summary: string
  links: Array<{ label: string; note?: string }>
}

export interface Project {
  slug: string
  index: string
  title: string
  cn: string
  tagline: string
  role: string
  year: string
  stack: string[]
  detail?: string
  links: ProjectLink[]
  summary: string
  en: ProjectEn
}

export const projects: Project[] = [
  {
    slug: 'mangofairvisa',
    index: '01',
    title: 'MANGO FAIR VISA',
    cn: '芒果表单',
    tagline: '展会预登记 + AI 资格审核 + 签证邀请函自动签发',
    role: '前端开发',
    year: '2024 — NOW',
    stack: ['Vue', '组件级权限', '路由与状态管理', 'AI 辅助设计系统'],
    detail: '/project/mangofairvisa',
    links: [{ label: '访问官网', href: 'https://www.mangofairvisa.com/about' }],
    summary:
      '面向国际展会主办方的一站式访客登记平台：自定义预登记表单、AI 资格审核、邀请函自动生成与邮件送达，替代人工审核与线下签发。',
    en: {
      tagline: 'Expo pre-registration + AI eligibility review + automated visa invitation letters',
      role: 'Frontend Developer',
      stack: ['Vue', 'Component-level permissions', 'Routing & state management', 'AI-assisted design system'],
      summary:
        'An all-in-one visitor registration platform for international expo organizers: customizable pre-registration forms, AI-assisted eligibility review, and automated invitation letter generation and delivery — replacing manual review and offline issuance.',
      links: [{ label: 'Visit website' }]
    }
  },
  {
    slug: 'canvas-web',
    index: '02',
    title: 'CANVAS WEB',
    cn: 'Canvas Web',
    tagline: '云端控制 + AI 工作流编排',
    role: '前端开发',
    year: '2024 — NOW',
    stack: ['Vue', '工作流编排', '云端托管', '部门与权限'],
    detail: '/project/canvas-web',
    links: [{ label: '在线试用', href: '' }, { label: '代码仓库', href: '', note: '待补充' }],
    summary:
      '把企业内部的 AI 能力搬上浏览器：节点式工作流编排、部门级权限隔离与云端托管，让非技术同事也能组合出可复用的智能流程。',
    en: {
      tagline: 'Cloud control + AI workflow orchestration',
      role: 'Frontend Developer',
      stack: ['Vue', 'Workflow orchestration', 'Cloud hosting', 'Departments & permissions'],
      summary:
        'Bringing in-house AI capabilities to the browser: node-based workflow orchestration, department-level permission isolation, and cloud hosting — so non-technical teammates can compose reusable intelligent workflows.',
      links: [{ label: 'Try it online' }, { label: 'Source code', note: 'Coming soon' }]
    }
  },
  {
    slug: 'starify',
    index: '03',
    title: 'STARIFY',
    cn: '星光跨境营销',
    tagline: '跨境营销移动端 · 离线通知必达',
    role: '移动应用开发',
    year: '2023 — 2024',
    stack: ['uni-app', 'uniCloud', '厂商推送', '云函数中间层'],
    detail: '/project/starify',
    links: [{ label: '访问官网', href: 'https://www.starify.cn/' }],
    summary:
      '网页端与 PC 端通知依赖在线状态，离线触达与即时回复长期缺失。用移动端加厂商通道补齐通知链路，并通过云函数中间层连接老系统。',
    en: {
      tagline: 'Cross-border marketing mobile app · offline notifications that always land',
      role: 'Mobile Developer',
      stack: ['uni-app', 'uniCloud', 'Vendor push channels', 'Cloud function middleware'],
      summary:
        'Web and desktop notifications depend on being online; offline reach and instant replies were long missing. A mobile app with vendor push channels closes the notification loop, while a cloud function middleware bridges the legacy system.',
      links: [{ label: 'Visit website' }]
    }
  },
  {
    slug: 'noteflow',
    index: '04',
    title: 'NOTE / FLOW',
    cn: 'NoteFlow',
    tagline: '手写标注 · 节拍器翻谱 · MusicXML 导出',
    role: '独立开发',
    year: '2025',
    stack: ['TypeScript', 'Vue', 'MusicXML', 'Canvas'],
    detail: '/project/noteflow',
    links: [{ label: '在线体验', href: '', note: '地址待补充' }, { label: 'GitHub', href: '', note: '待补充' }],
    summary:
      '给乐谱练习者准备的网页工具：在谱面上手写标注、按节拍自动翻谱，并把图片或 PDF 乐谱导出为可编辑的 MusicXML。',
    en: {
      tagline: 'Handwritten annotation · metronome page-turning · MusicXML export',
      role: 'Independent Developer',
      stack: ['TypeScript', 'Vue', 'MusicXML', 'Canvas'],
      summary:
        'A web tool for music practice: annotate directly on the score, turn pages automatically to the beat, and export image or PDF scores as editable MusicXML.',
      links: [{ label: 'Live demo', note: 'Coming soon' }, { label: 'GitHub', note: 'Coming soon' }]
    }
  },
  {
    slug: 'zhangshang-puyuan',
    index: '05',
    title: 'CAMPUS MOBILE',
    cn: '掌上莆院',
    tagline: '非校园网也能查教务',
    role: '全栈开发',
    year: '2022 — 2023',
    stack: ['uni-app', 'uniCloud', 'uni-admin', 'uView', 'Nginx'],
    detail: '/project/zhangshang-puyuan',
    links: [{ label: '代码仓库', href: '', note: '待补充' }],
    summary:
      '校园网限制下的成绩、课程与考试地点查询工具：移动端查询、公告与用户管理后台，以及内网穿透 + Nginx 反向代理部署。',
    en: {
      tagline: 'Academic records without the campus network',
      role: 'Full-stack Developer',
      stack: ['uni-app', 'uniCloud', 'uni-admin', 'uView', 'Nginx'],
      summary:
        'Grades, courses, and exam venues without the campus network: mobile queries, an announcements and user admin console, deployed via intranet tunneling and an Nginx reverse proxy.',
      links: [{ label: 'Source code', note: 'Coming soon' }]
    }
  },
  {
    slug: 'resume-tool',
    index: '06',
    title: 'RESUME EDITOR',
    cn: '简历编辑器',
    tagline: '在浏览器里写一份可导出的简历',
    role: '独立开发',
    year: '2023',
    stack: ['Vue', 'Markdown', 'PDF 导出'],
    detail: 'https://www.zhoujump.com/blog/p/resume-tool-index/',
    links: [{ label: '打开文章', href: 'https://www.zhoujump.com/blog/p/resume-tool-index/' }],
    summary: '一个轻量的在线简历编辑器：结构化填写、实时预览，并导出为可投递的 PDF。',
    en: {
      tagline: 'Write an exportable resume in the browser',
      role: 'Independent Developer',
      stack: ['Vue', 'Markdown', 'PDF export'],
      summary: 'A lightweight online resume editor: structured editing, live preview, and export to a submittable PDF.',
      links: [{ label: 'Read article' }]
    }
  }
]

export const homepageProjects = projects.filter((project) => project.slug !== 'resume-tool' && project.slug !== 'zhangshang-puyuan')

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function nextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug)
  const next = projects[(index + 1) % projects.length]
  return next ?? projects[0]!
}
