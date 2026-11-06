import { findProject, nextProject, type Project } from './projects'

export interface DetailFeature {
  label: string
  title: string
  body: string
  points: string[]
}

export interface DetailBlock {
  title: string
  desc: string
}

export interface ProjectDetailContent {
  project: Project
  heroTitle: [string, string]
  note: string
  backgroundIntro: string
  background: DetailBlock[]
  features: DetailFeature[]
  gallery: string[]
  matrix?: { columns: string[]; rows: string[][] }
  next: Project
}

export interface ProjectDetailEntry {
  zh: ProjectDetailContent
  en: ProjectDetailContent
}

function build(slug: string, content: Omit<ProjectDetailContent, 'project' | 'next'>): ProjectDetailContent {
  const project = findProject(slug)

  if (!project) {
    throw new Error(`Unknown project: ${slug}`)
  }

  return { project, next: nextProject(slug), ...content }
}

export const mangofairvisa: ProjectDetailEntry = {
  zh: build('mangofairvisa', {
    heroTitle: ['MANGO', 'FAIR VISA'],
    note: 'AI 预登记 + 签证邀请函',
    backgroundIntro:
      '国际展会主办方的访客登记长期依赖人工流程：表单收集、资格核验与邀请函签发分散在不同工具里，旺季时审核与沟通成本会被迅速放大。',
    background: [
      { title: '人工审核低效', desc: '大量登记信息需要逐条核对，申请高峰期容易积压。' },
      { title: '邀请函签发慢', desc: '模板套用、附件生成与邮件发送都靠人工，周期不可控。' },
      { title: '访客数据分散', desc: '不同渠道的登记、审核结果与沟通记录无法汇总。' },
      { title: '运营成本高', desc: '重复劳动与跨时区沟通持续消耗团队精力。' }
    ],
    features: [
      {
        label: '01 / REGISTRATION',
        title: '预登记表单',
        body: '把展会登记从固定表格变成可配置表单：主办方按展会自定义字段，一键发布到多个渠道，访客填写后实时同步到后台。',
        points: ['自定义字段与校验规则', '全渠道发布与二维码入口', '多语言界面与实时数据同步']
      },
      {
        label: '02 / REVIEW',
        title: 'AI 资格审核',
        body: '规则引擎先做基础校验，AI 模型辅助识别材料中的异常与风险，把人工审核集中到真正需要判断的申请上。',
        points: ['规则 + 模型双层校验', '异常申请自动标记', '审核结果与状态可追踪']
      },
      {
        label: '03 / INVITATION',
        title: '邀请函自动生成与送达',
        body: '审核通过后按模板生成邀请函，自动发送邮件并记录送达状态，减少人工套模板与重复沟通。',
        points: ['模板化批量生成', '邮件自动送达', '状态回写与失败重试']
      }
    ],
    gallery: ['REGISTRATION FORM', 'AI REVIEW', 'INVITATION']
  }),
  en: build('mangofairvisa', {
    heroTitle: ['MANGO', 'FAIR VISA'],
    note: 'AI pre-registration + visa invitation letters',
    backgroundIntro:
      'Visitor registration for international expos has long relied on manual work: form collection, eligibility checks, and invitation letter issuance scattered across different tools, with review and communication costs ballooning in peak season.',
    background: [
      { title: 'Inefficient manual review', desc: 'Every submission has to be checked line by line, and applications pile up at peak times.' },
      { title: 'Slow letter issuance', desc: 'Templates, attachments, and emails are all handled manually, making turnaround unpredictable.' },
      { title: 'Scattered visitor data', desc: 'Registrations, review outcomes, and communication records across channels cannot be consolidated.' },
      { title: 'High operating costs', desc: 'Repetitive work and cross-timezone communication constantly drain the team.' }
    ],
    features: [
      {
        label: '01 / REGISTRATION',
        title: 'Pre-registration forms',
        body: 'Turn expo registration from a fixed table into configurable forms: organizers define fields per expo, publish to multiple channels in one click, and submissions sync to the backend in real time.',
        points: ['Custom fields and validation rules', 'Multi-channel publishing with QR entry', 'Multilingual UI with real-time sync']
      },
      {
        label: '02 / REVIEW',
        title: 'AI eligibility review',
        body: 'A rules engine handles baseline validation while AI models flag anomalies and risks in submitted materials, focusing human review on the applications that truly need judgment.',
        points: ['Two-layer rules + model checks', 'Automatic flagging of anomalies', 'Traceable review outcomes and status']
      },
      {
        label: '03 / INVITATION',
        title: 'Invitation letters, generated and delivered',
        body: 'Once approved, invitation letters are generated from templates, emailed automatically, and tracked for delivery — no more manual templating or repeated follow-ups.',
        points: ['Templated batch generation', 'Automated email delivery', 'Status write-back and retries']
      }
    ],
    gallery: ['REGISTRATION FORM', 'AI REVIEW', 'INVITATION']
  })
}

export const canvasWeb: ProjectDetailEntry = {
  zh: build('canvas-web', {
    heroTitle: ['CANVAS', 'WEB'],
    note: '云端控制 · AI 工作流',
    backgroundIntro:
      '企业内部的 AI 能力往往散落在脚本、工具与个人经验里。Canvas Web 想做的，是把它变成可视化、可授权、可托管的公共能力。',
    background: [
      { title: '能力分散', desc: '模型调用与业务逻辑封装在零散脚本里，难以复用。' },
      { title: '权限粗放', desc: '部门之间缺少清晰的数据与操作边界。' },
      { title: '部署成本高', desc: '每个流程都要单独上线、单独维护。' }
    ],
    features: [
      {
        label: '01 / WORKFLOW',
        title: '节点式工作流编排',
        body: '把模型调用、数据处理与条件分支拆成节点，在画布上拖拽组合，实时查看数据在每一步的形态。',
        points: ['节点拖拽与连线校验', '运行前参数预检', '执行记录与失败重放']
      },
      {
        label: '02 / PERMISSION',
        title: '部门与权限',
        body: '工作流、资源与操作都按部门划分权限。组件级权限控制到按钮，共享与隔离的边界由管理员配置。',
        points: ['部门级资源隔离', '组件级操作权限', '共享工作流的只读边界']
      },
      {
        label: '03 / CLOUD',
        title: '云端托管',
        body: '流程发布后由云端统一调度与托管，版本、运行状态与日志集中呈现，不再为每个流程单独搭一套环境。',
        points: ['一键发布与版本管理', '集中运行监控', '按需扩缩的托管执行']
      }
    ],
    gallery: ['WORKFLOW CANVAS', 'PERMISSION MATRIX', 'CLOUD CONSOLE'],
    matrix: {
      columns: ['角色', '编排工作流', '发布流程', '查看运行日志', '管理部门成员'],
      rows: [
        ['管理员', '✓', '✓', '✓', '✓'],
        ['部门负责人', '✓', '✓', '✓', '—'],
        ['成员', '✓', '—', '✓', '—'],
        ['访客', '—', '—', '—', '—']
      ]
    }
  }),
  en: build('canvas-web', {
    heroTitle: ['CANVAS', 'WEB'],
    note: 'Cloud control · AI workflows',
    backgroundIntro:
      'In-house AI capabilities are usually scattered across scripts, tools, and individual know-how. Canvas Web turns them into shared capabilities that are visual, permissioned, and hosted.',
    background: [
      { title: 'Scattered capabilities', desc: 'Model calls and business logic live in ad-hoc scripts that are hard to reuse.' },
      { title: 'Coarse permissions', desc: 'Departments lack clear boundaries around data and operations.' },
      { title: 'Costly deployment', desc: 'Every workflow needs its own release and upkeep.' }
    ],
    features: [
      {
        label: '01 / WORKFLOW',
        title: 'Node-based workflow orchestration',
        body: 'Model calls, data processing, and conditional branches become nodes you drag and connect on a canvas, with live visibility into the data at every step.',
        points: ['Drag-and-drop nodes with connection validation', 'Pre-run parameter checks', 'Execution logs and failure replay']
      },
      {
        label: '02 / PERMISSION',
        title: 'Departments & permissions',
        body: 'Workflows, resources, and operations are permissioned by department. Component-level control reaches down to individual buttons, while admins configure where sharing ends and isolation begins.',
        points: ['Department-level resource isolation', 'Component-level operation permissions', 'Read-only boundaries for shared workflows']
      },
      {
        label: '03 / CLOUD',
        title: 'Cloud hosting',
        body: 'Once published, workflows are scheduled and hosted in the cloud, with versions, run status, and logs in one place — no more spinning up an environment per workflow.',
        points: ['One-click publishing and version management', 'Centralized run monitoring', 'Hosted execution that scales on demand']
      }
    ],
    gallery: ['WORKFLOW CANVAS', 'PERMISSION MATRIX', 'CLOUD CONSOLE'],
    matrix: {
      columns: ['Role', 'Compose workflows', 'Publish', 'View run logs', 'Manage members'],
      rows: [
        ['Admin', '✓', '✓', '✓', '✓'],
        ['Department lead', '✓', '✓', '✓', '—'],
        ['Member', '✓', '—', '✓', '—'],
        ['Guest', '—', '—', '—', '—']
      ]
    }
  })
}

export const starify: ProjectDetailEntry = {
  zh: build('starify', {
    heroTitle: ['STARIFY', '星光'],
    note: '跨境营销移动端 · 离线通知必达',
    backgroundIntro:
      '跨境营销团队的客户沟通大量发生在网页端与 PC 端，一旦离线，通知就断了。星光用移动端补齐这条链路，并让老系统继续工作。',
    background: [
      { title: '通知依赖在线', desc: '网页与 PC 端在离线状态下无法触达客户，消息容易漏掉。' },
      { title: '新客响应慢', desc: '缺少统一的即时沟通入口，咨询与跟进被分散。' },
      { title: '老系统难接', desc: '客户数据与业务逻辑封装在旧系统中，迁移成本高。' }
    ],
    features: [
      {
        label: '01 / PUSH',
        title: '离线推送',
        body: '接入各厂商推送通道，App 不在前台也能收到新客户与业务通知，保证跨境场景下的触达率。',
        points: ['厂商通道统一接入', '离线消息可靠下发', '通知到达与点击追踪']
      },
      {
        label: '02 / CHAT',
        title: '新客即时沟通',
        body: '新客户进入后立即推送提醒，销售可在移动端快速查看资料、回复消息并记录跟进状态。',
        points: ['新客实时提醒', '移动端快速回复', '沟通记录与客户状态同步']
      },
      {
        label: '03 / BRIDGE',
        title: 'uniCloud 中间层',
        body: '用云函数搭建中间层连接老系统，屏蔽协议与数据格式差异，在不重写老系统的前提下完成移动端接入。',
        points: ['云函数对接老系统', '协议与数据格式转换', '按业务拆分可独立部署']
      }
    ],
    gallery: ['PUSH CENTER', 'CUSTOMER CHAT', 'CLOUD FUNCTIONS']
  }),
  en: build('starify', {
    heroTitle: ['STARIFY', ''],
    note: 'Cross-border marketing app · reliable offline push',
    backgroundIntro:
      'Cross-border marketing teams talk to customers mostly on web and desktop — once offline, notifications stop. Starify closes that gap with a mobile app, while keeping the legacy system working.',
    background: [
      { title: 'Online-only notifications', desc: 'Web and desktop cannot reach anyone while offline, so messages get missed.' },
      { title: 'Slow responses to new leads', desc: 'Without a unified instant messaging entry, inquiries and follow-ups stay fragmented.' },
      { title: 'Hard-to-integrate legacy system', desc: 'Customer data and business logic are locked inside the old system, making migration costly.' }
    ],
    features: [
      {
        label: '01 / PUSH',
        title: 'Offline push',
        body: 'Unified access to vendor push channels delivers new-customer and business notifications even when the app is in the background, securing reach in cross-border scenarios.',
        points: ['Unified vendor channel integration', 'Reliable offline delivery', 'Delivery and click tracking']
      },
      {
        label: '02 / CHAT',
        title: 'Instant messaging for new leads',
        body: 'New customers trigger instant push alerts; sales can view profiles, reply, and log follow-up status right from mobile.',
        points: ['Real-time new-lead alerts', 'Quick replies on mobile', 'Synced chat history and customer status']
      },
      {
        label: '03 / BRIDGE',
        title: 'uniCloud middleware',
        body: 'Cloud functions form a middleware layer that connects to the legacy system, smoothing over protocol and data format differences — mobile integration without rewriting the old system.',
        points: ['Cloud functions bridging the legacy system', 'Protocol and data format conversion', 'Split by business domain, independently deployable']
      }
    ],
    gallery: ['PUSH CENTER', 'CUSTOMER CHAT', 'CLOUD FUNCTIONS']
  })
}

export const noteflow: ProjectDetailEntry = {
  zh: build('noteflow', {
    heroTitle: ['NOTE', 'FLOW'],
    note: '手写标注 · 节拍器翻谱 · MusicXML',
    backgroundIntro:
      '练琴时，纸质谱、电子谱与练习记录彼此割裂：想标注要打印，想翻谱要停手，想把图片乐谱改一改又无从下手。NoteFlow 从这三个动作出发。',
    background: [
      { title: '标注分散', desc: '纸质谱与电子谱无法统一批注，练习痕迹难以沉淀。' },
      { title: '翻谱打断练习', desc: '手动翻页会打断节奏，影响连贯演奏。' },
      { title: '乐谱格式封闭', desc: '图片与 PDF 乐谱难以二次编辑或复用。' }
    ],
    features: [
      {
        label: '01 / ANNOTATION',
        title: '手写标注',
        body: '在谱面上直接手写批注，笔迹与页面缩放同步，支持撤销与分层管理，练习痕迹可以保存和回看。',
        points: ['Canvas 手写笔迹', '缩放与滚动同步', '撤销、重做与分层']
      },
      {
        label: '02 / METRONOME',
        title: '节拍器与翻谱',
        body: '按设定 BPM 播放节拍，结合曲目长度自动滚动或翻页，让练习过程不被打断。',
        points: ['可调 BPM 与拍号', '自动滚动 / 翻页', '练习计时与节奏提示']
      },
      {
        label: '03 / EXPORT',
        title: '图片 / PDF → MusicXML',
        body: '识别乐谱图像中的结构，导出为可编辑的 MusicXML，方便在其它制谱软件里继续修改。',
        points: ['图片与 PDF 导入', '乐谱结构识别', '导出标准 MusicXML']
      }
    ],
    gallery: ['ANNOTATION VIEW', 'METRONOME', 'MUSICXML EXPORT']
  }),
  en: build('noteflow', {
    heroTitle: ['NOTE', 'FLOW'],
    note: 'Handwritten annotation · metronome page-turning · MusicXML',
    backgroundIntro:
      'During practice, paper scores, digital scores, and practice notes live in separate worlds: annotating means printing, turning pages means stopping, and editing an image score is a dead end. NoteFlow starts from these three actions.',
    background: [
      { title: 'Scattered annotations', desc: 'Paper and digital scores cannot be annotated in one place, so practice marks never accumulate.' },
      { title: 'Page turns interrupt practice', desc: 'Turning pages by hand breaks the rhythm of continuous playing.' },
      { title: 'Closed score formats', desc: 'Image and PDF scores are hard to edit or reuse.' }
    ],
    features: [
      {
        label: '01 / ANNOTATION',
        title: 'Handwritten annotation',
        body: 'Annotate directly on the score; strokes stay in sync with zooming and scrolling, with undo and layered management, so practice marks can be saved and revisited.',
        points: ['Canvas-based handwriting', 'Zoom and scroll in sync', 'Undo, redo, and layers']
      },
      {
        label: '02 / METRONOME',
        title: 'Metronome & page turning',
        body: 'The metronome plays at your chosen BPM and scrolls or turns pages automatically based on the piece length, keeping practice uninterrupted.',
        points: ['Adjustable BPM and time signature', 'Auto scroll / page turn', 'Practice timer and beat cues']
      },
      {
        label: '03 / EXPORT',
        title: 'Image / PDF → MusicXML',
        body: 'Recognizes structure in score images and exports editable MusicXML, so you can keep refining in other notation software.',
        points: ['Image and PDF import', 'Score structure recognition', 'Standard MusicXML export']
      }
    ],
    gallery: ['ANNOTATION VIEW', 'METRONOME', 'MUSICXML EXPORT']
  })
}

export const zhangshangPuyuan: ProjectDetailEntry = {
  zh: build('zhangshang-puyuan', {
    heroTitle: ['CAMPUS', 'MOBILE'],
    note: '非校园网查教务',
    backgroundIntro:
      '教务系统通常只对校园网开放。掌上莆院把成绩、课程与考试地点查询搬到手机，并用内网穿透与反向代理解决访问边界。',
    background: [
      { title: '校园网限制', desc: '离开校园网后无法直接访问教务系统。' },
      { title: '信息入口分散', desc: '成绩、课程与考试地点需要在不同页面反复查找。' },
      { title: '缺少管理端', desc: '公告、用户与查询配置没有统一维护入口。' }
    ],
    features: [
      {
        label: '01 / QUERY',
        title: '成绩 / 课程 / 考试查询',
        body: '把分散的教务信息收敛到统一入口，按学期与类型组织，减少反复登录与页面跳转。',
        points: ['成绩与课程列表', '考试时间与地点', '按学期归档与缓存']
      },
      {
        label: '02 / ADMIN',
        title: '公告与用户管理',
        body: '基于 uni-admin 搭建后台，维护公告、用户与查询配置，让内容更新不依赖改代码。',
        points: ['公告发布与置顶', '用户与权限管理', '查询配置可维护']
      },
      {
        label: '03 / DEPLOY',
        title: '内网穿透与反向代理',
        body: '通过内网穿透把校内服务暴露到公网，再用 Nginx 反向代理与域名提供稳定入口。',
        points: ['内网穿透映射', 'Nginx 反向代理', '域名与 HTTPS 配置']
      }
    ],
    gallery: ['QUERY', 'ADMIN CONSOLE', 'DEPLOYMENT']
  }),
  en: build('zhangshang-puyuan', {
    heroTitle: ['CAMPUS', 'MOBILE'],
    note: 'Academic records without the campus network',
    backgroundIntro:
      'The academic system is usually open only to the campus network. 掌上莆院 moves grades, courses, and exam venue queries to mobile, using intranet tunneling and a reverse proxy to cross the access boundary.',
    background: [
      { title: 'Campus network restriction', desc: 'The academic system is unreachable off the campus network.' },
      { title: 'Fragmented information', desc: 'Grades, courses, and exam venues are spread across different pages.' },
      { title: 'No admin console', desc: 'Announcements, users, and query settings lack a unified place to be maintained.' }
    ],
    features: [
      {
        label: '01 / QUERY',
        title: 'Grades / courses / exams',
        body: 'Scattered academic information converges into one entry, organized by semester and type — fewer repeated logins and page hops.',
        points: ['Grade and course lists', 'Exam times and venues', 'Semester archiving and caching']
      },
      {
        label: '02 / ADMIN',
        title: 'Announcements & user management',
        body: 'An admin console built on uni-admin maintains announcements, users, and query configuration — content updates no longer require code changes.',
        points: ['Announcement publishing and pinning', 'User and permission management', 'Maintainable query configuration']
      },
      {
        label: '03 / DEPLOY',
        title: 'Intranet tunneling & reverse proxy',
        body: 'Intranet tunneling exposes campus services to the public internet, while an Nginx reverse proxy and a domain provide a stable entry point.',
        points: ['Intranet tunneling', 'Nginx reverse proxy', 'Domain and HTTPS setup']
      }
    ],
    gallery: ['QUERY', 'ADMIN CONSOLE', 'DEPLOYMENT']
  })
}
