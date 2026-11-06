# zhoujump.com v3 开发计划

- 仓库 / 分支：`main-page` / `version3`（空分支已创建）
- 目标域名：`www.zhoujump.com`、`blog.zhoujump.com`
- 状态：方案待确认，尚未开始编码
- 设计参考：`https://deepbook-v2-wip.webflow.io/`（只复用布局、组件形态、动效模式，不复制其品牌、文案、字体文件与图片素材）

---

## 1. 目标与边界

### 1.1 目标

1. 用 Nuxt 重构 `www` 与 `blog` 两个站点，共用一套设计系统与组件库。
2. 两个子域绑定同一个应用，`blog` 作为站点的文章板块。
3. 原 `www.zhoujump.com/blog` 及其子路径 301 到 `blog.zhoujump.com`。
4. 原有 110 条 sitemap URL、分页、特殊页面、RSS、搜索索引、Markdown 备用地址全部可访问，不产生 404。
5. 用 Nuxt UI 搭建单账户 CMS，支持文章、分类、标签、评论、分类封面的管理。
6. 内置评论：读者无需登录，提交时通过 Cloudflare Turnstile；头像由邮箱哈希从 Gravatar 获取；评论默认直接展示，CMS 可隐藏/删除。
7. 首页内容丰富化：技术栈、最近项目、最近文章、履历摘要、联系方式。
8. 视觉与交互按参考站点还原，用 GSAP + Lenis 实现首屏加载、页面切换、滚动揭示、跑马灯、数字计数、固定横滚等效果。
9. `NoteFlow`、`Canvas Web`、`芒果表单`、`星光跨境营销` 各做一个单页介绍；`简历编辑器` 直接链接到博客文章；`掌上莆院` 只在项目总览保留概览卡。实习项目与其他课程设计不再展示。
10. 所有需要图片、复杂 SVG 插画的位置，统一留带边框的空容器，方便手动替换；图标使用 Remix Icon。

### 1.2 非目标

- 不做用户注册、多用户、角色权限。
- 不做文章审核流；评论无审核，CMS 只做事后管理。
- 不复制参考站点的品牌内容、商业字体文件、图片素材。
- 不重做旧博客的历史评论数据迁移（可作为可选项）。
- 主站首页/项目/关于文案写死在代码中，不纳入 CMS。

---

## 2. 原站点基线（已实测）

### 2.1 `www.zhoujump.com`

| 项目 | 现状 |
| --- | --- |
| 技术栈 | VitePress（version2 分支） |
| 导航 | 首页 `/`、项目 `/project`、博客 `/blog`、关于 `/about` |
| 状态 | `/`、`/project`、`/about`、`/blog` 均 200；`/blog/` 为 404 |
| 博客 | 仅入口页，内容实际在 `blog.zhoujump.com` |
| sitemap | `/`、`/project`、`/blog`、`/about` |

### 2.2 `blog.zhoujump.com`

| 项目 | 现状 |
| --- | --- |
| 技术栈 | Hugo + Stack 主题 |
| 标题 | 粥粥个人博客 |
| 语言 | 中文默认无前缀；英文 `/en/` 前缀 |
| sitemap | 中文 55 条、英文 55 条，结构对称 |
| 文章 | 中文 23 篇、英文 23 篇，URL `/p/{slug}/` |
| 分类 | 8 个：`technology`、`nuxt`、`vue`、`css`、`html`、`javascript`、`resume-tool`、`groceries` |
| 标签 | 中文 16 个、英文 16 个；中文标签 slug 使用百分号编码，如 `/tags/%E4%B8%AA%E4%BA%9B%E9%A1%B9%E7%9B%AE/` |
| 分页 | 每页 5 篇；首页 `/page/{n}/` 共 5 页；分类/标签同样每页 5 篇 |
| 特殊页 | `/archives/`、`/categories/`、`/tags/`、`/search/`、`/links/`、`/post/`、`/page/` |
| 搜索 | `/search/?keyword=...` + `/search/index.json`（23 条，字段 `content/date/image/permalink/title`） |
| RSS | `/index.xml`（中文）、`/en/index.xml`（英文） |
| 站点地图 | `/sitemap.xml` 索引 → `/zh-cn/sitemap.xml`、`/en/sitemap.xml` |
| Markdown 备用 | `/index.md`、`/en/index.md` |
| 评论 | Artalk |
| 尾斜杠 | `/p/x` 与 `/p/x/` 均返回 200，需两者都能访问 |
| 语言别名 | `/zh-cn/` 返回 200；`/zh-cn/p/...` 为 404 |

### 2.3 URL 迁移清单

必须保持可访问的旧地址：

- 110 条 sitemap URL（中文 55 + 英文 55）
- `/page/1/` 至 `/page/5/`、`/en/page/1/` 至 `/en/page/5/`
- `/zh-cn/`
- `/search/index.json`
- `/index.xml`、`/en/index.xml`
- `/index.md`、`/en/index.md`
- `/sitemap.xml`、`/zh-cn/sitemap.xml`、`/en/sitemap.xml`
- 带尾斜杠与不带尾斜杠两种形式

> 范围说明：只保证页面地址可访问；图片、附件等资源文件不做旧地址兼容，也不迁移旧站资源。

---

## 3. 技术选型

| 层级 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Nuxt 4 + TypeScript | 单应用、SSR、Nitro 服务端路由 |
| UI | Nuxt UI 4 + Tailwind CSS | 用其组件搭 CMS；营销页在主题变量上二次封装 |
| 数据库 | PostgreSQL | 由你提供 |
| ORM | Prisma 6 | schema、迁移、类型安全、seed |
| 认证 | `nuxt-auth-utils` + bcrypt | 单账户、密封 Cookie 会话、httpOnly |
| 富文本/Markdown | `markdown-it` + `shiki` + `isomorphic-dompurify` | 存 Markdown 原文，服务端渲染 HTML + TOC |
| 编辑器 | 自建分屏 Markdown 编辑器 | **Nuxt UI 不自带 Markdown 编辑器**；用 `UTextarea` + Nuxt UI 工具栏 + 实时预览实现 |
| 动效 | GSAP 3 + ScrollTrigger + Lenis | 参考站点本身即 GSAP + Lenis |
| 图标 | `@remixicon/vue` | 全站统一，不使用图片图标 |
| 字体 | Inter Tight / Inter / JetBrains Mono / Noto Sans SC | 参考站点 Twk Everett 为商业字体，使用近似开源替代 |
| RSS | `feed` | 生成 `/index.xml` 兼容结构 |
| 图片处理 | `sharp` | 上传压缩、尺寸限制、WebP |
| 测试 | Vitest + `@nuxt/test-utils`；Playwright | 单测 + 路由迁移 E2E |
| 部署 | Node 容器 + Nginx + PostgreSQL | 与你提供的环境对齐 |

### 3.1 架构形态

推荐**单个 Nuxt 应用**，通过 `Host` 请求头分流两个站点，而不是两个独立应用：

```
www.zhoujump.com  ─┐
                   ├─ Nginx（同一 upstream）─ Nuxt 单实例 ─ PostgreSQL
blog.zhoujump.com ─┘
```

理由：

- 设计系统、数据库、CMS、评论只维护一份。
- `www` 首页“最近文章”可直接读同一数据库。
- 一套 Docker 镜像，一个 Node 容器即可部署。
- 两个域名的页面路径几乎不冲突，只有 `/` 需要按 Host 分支。

备选：拆成两个 Nuxt 应用（`apps/www`、`apps/blog`）+ 共享 UI 包。只有在单应用 Host 分流遇到严重问题时才切换。

### 3.2 域名分流规则

服务端中间件 `server/middleware/01-site.ts`：

1. 读取 `Host`，去掉端口并转小写。
2. `www` / 裸域 → `site = www`；`blog` → `site = blog`。
3. 未知 Host（IP、localhost）默认 `www`；开发时可用 `blog.localhost:3000` 或 `SITE=blog` 切换。
4. 跨站路径直接 301 到正确域名（见第 5 节）。
5. `www` 下的 `/admin` 可访问；`blog` 下的 `/admin` 301 到 www。
6. 页面组件通过 `useSite()` 获取当前站点；客户端的导航、页脚、SEO 基址随之切换。
7. `pages/index.vue` 按站点渲染 `WwwHome` 或 `BlogHome`，其余博客路径各自占用独立页面文件，不与主站冲突。

### 3.3 多语言方案

不使用 `@nuxtjs/i18n` 的自动路由，改为**显式 `/en/` 页面镜像**：

```
/p/[slug]              → BlogPostPage lang=zh
/en/p/[slug]           → BlogPostPage lang=en
/categories/[slug]     → BlogCategoryPage lang=zh
/en/categories/[slug]  → BlogCategoryPage lang=en
...
```

理由：

- 完全控制 URL，严格对齐旧站，不让主站被自动加 `/en` 前缀。
- 只做静态 UI 文案词典 + 数据库 `lang` 字段，不引入完整 i18n 框架。
- 语言切换、hreflang、canonical 都按真实翻译是否存在来生成。

---

## 4. 信息架构与页面编排

### 4.1 `www.zhoujump.com`

| 路径 | 页面 | 内容 |
| --- | --- | --- |
| `/` | 首页 | Hero、技术栈、最近项目、最近文章、履历摘要、联系方式 |
| `/project` | 项目列表 | 六个项目大图（五个有单页，简历编辑器跳博客） |
| `/project/noteflow` | NoteFlow 单页 | 项目 Hero、功能介绍、技术栈、截图、GitHub/体验入口 |
| `/project/canvas-web` | Canvas Web 单页 | 项目 Hero、功能介绍、架构/权限说明、试用入口、仓库占位按钮 |
| `/project/mangofairvisa` | 芒果表单单页 | 项目 Hero、痛点、核心能力、技术职责、官网入口 |
| `/project/starify` | 星光单页 | 项目 Hero、通知/沟通场景、云开发架构、官网入口 |
| `/project/zhangshang-puyuan` | 掌上莆院单页 | 项目 Hero、教务查询、管理后台、部署与反代 |
| `/about` | 关于/履历 | 个人介绍、工作经历、技能矩阵、教育经历、简历下载、简历编辑器入口 |
| `/admin/**` | CMS | 单账户后台 |
| `/blog`、`/blog/*` | 重定向 | 301 到 `blog.zhoujump.com` |

#### 首页版块顺序

1. **首屏加载层**（全局，非独立版块）
2. **公告条**：`OPEN TO WORK · 前端开发工程师 · 厦门` + 简历链接
3. **导航**：Logo、首页、项目、关于、文章（外链 blog）、GitHub、邮箱；移动端全屏菜单
4. **Hero**：超大 `FRONT-END / DEVELOPER` 字体 + 中文自我介绍 + 新 Slogan + 两个 CTA（查看项目 / 下载简历）+ 人像/视觉空框 + 网格与光晕背景 + 滚动提示
5. **技术跑马灯**：双行反向滚动，关键词为技术栈与能力标签
6. **最近项目**：4 个项目大图面板，顺序为 芒果表单 → Canvas Web → 星光跨境营销 → NoteFlow（每张图 ≥ 50vh），四种不同版式（全幅粘性、左右错位、横向滑动、编号覆盖），带项目编号、角色、技术标签；末尾放“简历编辑器”紧凑链接与“全部项目”
7. **技术栈**：参考站点 Stack Cards 的横向固定滚动，点状进度 + 加号装饰；按“熟练 / 熟悉 / 了解”分组
8. **数字统计**：2 年经验、6 个项目、23 篇文章、8 个技术域（GSAP 数字滚动）
9. **最近文章**：从数据库取最新 4 篇，编号行 + 分类封面缩略图 + 日期/阅读时长
10. **关于摘要**：左人像框 + 右简介与经历高亮 + “完整履历”链接（与 Hero 版式不同）
11. **个人宣言**：居中超大字 + 联系方式 CTA（参考站点 Ethos/Statement 区）
12. **页脚**：导航列、社交、RSS、音频条装饰、备案信息

#### `/project` 版块顺序

1. 紧凑型编辑式 Hero（标题 `WORK / 项目` + 6 个项目 + 一句话，不复用首页 Hero）
2. 六个项目编辑式区块：图片 ≥ 50vh，顺序为 芒果表单 → Canvas Web → 星光跨境营销 → NoteFlow → 简历编辑器 → 掌上莆院；版式分别为“全幅压字 / 左图右文 / 右图左文 / 错位双栏 / 横向滚动 / 编号覆盖”
3. 前四个与 `掌上莆院` 进入站内单页；`简历编辑器` 进入博客文章
4. 不再展示实习项目与其他课程设计
5. CTA + 页脚

#### `/project/noteflow` 版块顺序

1. **项目 Hero**：超大 `NOTE / FLOW` 标题、产品视觉空框、功能跑马灯、`在线体验` + `GitHub` 两个 CTA、背景光晕与网格
2. **项目概述**：问题 / 方案双栏，编辑式排版
3. **功能章节**：手写标注、节拍器与翻谱、图片/PDF → MusicXML 导出；三种不同版式（分屏、全幅图、编号步骤 + 粘性视觉）
4. **技术栈**：TypeScript、Vue、JavaScript 等标签墙
5. **产品画廊**：三张不对称排列的截图空框
6. **结尾 CTA** + 下一个项目

#### `/project/canvas-web` 版块顺序

1. **项目 Hero**：超大 `CANVAS / WEB` 标题、节点图装饰 SVG 动画（小型装饰，自行实现）、`在线试用` CTA、`代码仓库` 禁用占位按钮、云控制/工作流说明
2. **项目概述**：云端控制、AI 工作流编排
3. **功能章节**：工作流编排、部门与权限、云端托管；三种不同版式
4. **架构说明**：自绘 SVG 架构图 + 权限矩阵表格（文字表格，不用图片）
5. **产品画廊**：截图空框
6. **结尾 CTA** + 下一个项目

#### `/project/mangofairvisa` 版块顺序

1. **项目 Hero**：超大 `MANGO / FAIR VISA` 标题、产品视觉空框、`AI 预登记 + 签证邀请函` 标签、`访问官网` CTA（`https://www.mangofairvisa.com/about`）、背景光晕与网格
2. **业务背景**：展会主办方四个痛点（人工审核低效、邀请函签发慢、访客数据分散、运营成本高），编号编辑式排列
3. **功能章节**：预登记表单（自定义字段、全渠道发布、实时同步、多语言）/ AI 资格审核 / 邀请函自动生成与邮件送达；三种不同版式
4. **技术职责**：Vue、组件级权限、路由与状态管理、AI 辅助设计系统与页面生成；前端开发
5. **产品画廊**：截图空框
6. **结尾 CTA** + 下一个项目

#### `/project/starify` 版块顺序

1. **项目 Hero**：超大 `STARIFY / 星光` 标题、产品视觉空框、`跨境营销移动端 · 离线通知必达` 标签、`访问官网` CTA（`https://www.starify.cn/`）、背景光晕与网格
2. **业务背景**：网页端/PC 端通知依赖在线，离线触达与即时回复缺失
3. **功能章节**：离线推送（厂商通道）/ 新客即时沟通 / uni-cloud 云函数中间层连接老系统；三种不同版式
4. **技术职责**：uni-app、uniCloud、厂商推送、云函数中间层；移动应用开发
5. **产品画廊**：截图空框
6. **结尾 CTA** + 下一个项目

#### `/project/zhangshang-puyuan` 版块顺序

1. **项目 Hero**：超大 `CAMPUS / MOBILE` 标题、手机界面视觉空框、`非校园网查教务` 标签、`返回项目总览` CTA、`代码仓库待补充` 禁用按钮、背景光晕与网格
2. **业务背景**：校园网限制下的成绩、课程、考试地点查询需求
3. **功能章节**：成绩/课程/考试查询 / 公告与用户管理后台 / 内网穿透、Nginx 反向代理与域名部署；三种不同版式
4. **技术职责**：uni-app、uniCloud、uni-admin、uView、Nginx；全栈开发
5. **产品画廊**：截图空框
6. **结尾 CTA** + 下一个项目

#### `/about` 版块顺序

1. 分屏 Hero：人像空框 + 姓名/职位/所在地/经验/邮箱，版式与首页 Hero 不同
2. 个人陈述
3. 工作经历时间轴：厦门聚页、国投智能（实习）、厦门独众（实习）；实习仅作履历，不单独做项目页
4. 技能矩阵：熟练 / 熟悉 / 了解三档
5. 精选项目横条：6 个项目，紧凑排版，不复用项目大卡
6. 教育经历与奖项：莆田学院、宣传部部长、微拍/文创奖项
7. 简历下载条 + `简历编辑器`（链接到博客文章）+ 联系方式

### 4.2 `blog.zhoujump.com`

| 路径 | 页面 |
| --- | --- |
| `/` | 博客首页（文章列表第 1 页） |
| `/page/[n]/` | 文章列表分页 |
| `/p/[slug]/` | 文章详情 |
| `/categories/` | 分类索引 |
| `/categories/[slug]/` | 分类文章列表 |
| `/tags/` | 标签索引 |
| `/tags/[slug]/` | 标签文章列表 |
| `/archives/` | 年度归档 |
| `/search/` | 搜索页（兼容 `?keyword=`） |
| `/links/` | 友链 |
| `/post/` | 兼容旧的文章列表入口 |
| `/page/` | 兼容旧的分页入口（等同第 1 页） |
| `/en/**` | 上述页面的英文镜像 |

#### 博客首页

1. 博客 Hero：`JOURNAL / 文章` 大字、文章总数、年份范围、RSS/搜索入口（背景与主站 Hero 不同）
2. 最新文章特写：分类封面 + 标题叠字的大图（新版封面体系）
3. 分类横向导航：8 个分类，图片/文字胶囊混合，不做成三列同款卡片
4. 最新文章列表：编号行 + 小封面 + 标题 + 日期 + 阅读时长 + 标签
5. 分页（每页 5 篇）
6. 页脚

#### 文章详情

1. 封面 Hero：分类图片铺底 + 文章标题（标题颜色按文章设置）+ 日期/阅读时长/分类/标签 + 中英文切换
2. 顶部阅读进度条
3. 正文 + 右侧粘性目录（TOC）
4. Markdown 排版：代码块复制、图片、表格、标题锚点
5. 文章底部：标签、版权说明、最后更新
6. 上一篇 / 下一篇（左右分屏）
7. 相关文章（横向滚动卡片）
8. 评论：列表 + 表单，Gravatar 头像，Turnstile，无登录
9. 页脚

#### 分类 / 标签 / 归档 / 搜索

- 分类索引：编辑式大小错落封面列表，不使用统一栅格卡片。
- 分类详情：分类封面 Hero + 列表行 + 分页。
- 标签索引：按文章数大小排版的文字云/列表，不用卡片。
- 标签详情：标签标题 + 年份分组列表。
- 归档：左侧粘性年份导航 + 右侧年份分组列表。
- 搜索：大输入框 + 实时结果；保留 `/search/?keyword=` 与 `/search/index.json`。
- 友链：保留旧站三个链接（粥粥的简历编辑器、粥粥的主页、博客说）。

### 4.3 CMS 页面

| 路径 | 功能 |
| --- | --- |
| `/admin/login` | 单账户登录 |
| `/admin` | 概览：文章/评论数量、最近评论、快捷入口 |
| `/admin/posts` | 文章列表：按语言、状态、分类、关键词筛选 |
| `/admin/posts/new`、`/admin/posts/[id]` | Markdown 编辑器 + 元信息 + 预览 |
| `/admin/categories` | 分类增删改、封面上传、名称、描述 |
| `/admin/tags` | 标签增删改、中英文名称 |
| `/admin/comments` | 评论列表、隐藏/显示、删除 |

CMS 用 Nuxt UI 的表单、表格、弹窗、Toast、下拉等组件搭建，不强行套营销页的视觉；保持同一套颜色变量和字体。

---

## 5. 路由与重定向

### 5.1 `www` → `blog`

| 旧地址 | 新行为 |
| --- | --- |
| `www.zhoujump.com/blog` | `301 https://blog.zhoujump.com/` |
| `www.zhoujump.com/blog/` | `301 https://blog.zhoujump.com/` |
| `www.zhoujump.com/blog/{任意路径}` | `301 https://blog.zhoujump.com/{任意路径}`，保留 query |
| `www.zhoujump.com/p/*`、`/categories/*`、`/tags/*`、`/page/*`、`/post/*`、`/archives`、`/links`、`/search`、`/en/*` | `301` 到 blog 同路径，避免重复内容 |

### 5.2 `blog` → `www`

| 旧地址 | 新行为 |
| --- | --- |
| `blog.zhoujump.com/project`、`/project/*` | `301` 到 www 同路径 |
| `blog.zhoujump.com/about` | `301` 到 www `/about` |
| `blog.zhoujump.com/admin`、`/admin/*` | `301` 到 www `/admin` |
| `blog.zhoujump.com/blog` | `301` 到 blog `/`（避免与 www 规则成环） |

### 5.3 旧地址兼容

| 地址 | 新行为 |
| --- | --- |
| `/page/`、`/page/1/` | 200，列表第 1 页 |
| `/post/` | 200，列表第 1 页 |
| `/zh-cn/` | 301 到 `/` |
| `/index.xml`、`/en/index.xml` | 200，RSS |
| `/index.md`、`/en/index.md` | 200，`text/markdown` 备用索引 |
| `/search/index.json` | 200，保持旧字段结构 |
| `/sitemap.xml` | 200，索引文件 |
| `/zh-cn/sitemap.xml`、`/en/sitemap.xml` | 200 |
| 带/不带尾斜杠 | 两者均 200；canonical 统一带尾斜杠 |

重定向约束：

- 链长不超过 1 跳。
- 不使用 302 作为长期迁移手段（除封面兜底）。
- 旧 URL 全部返回 200 或 301，返回 404 的数量为 0。

---

## 6. 视觉与交互还原

### 6.1 设计令牌（取自参考站点）

| 令牌 | 值 |
| --- | --- |
| 背景 | `#0B0D10` / `#131518` |
| 表面 | `#16181C` / `#1F1F1F` |
| 边框 | `#2A2F34` |
| 主文字 | `#EFEFEB` |
| 次文字 | `#6A7681` / `#8B949E` |
| 强调色 | `#1E6EF3`，hover `#1349EC` |
| 浅色反转区 | `#EFEFEB`（技术栈区使用一次，形成节奏对比） |
| 容器 | 最大 1440px，统一左右留白 |
| 圆角 | 胶囊按钮、8px 卡片、1px 描边 |
| 栅格 | 12 列；装饰用点线、方块、十字角标 |

字体：

- 英文展示：Inter Tight（近似 Twk Everett 的紧凑无衬线）
- 正文：Inter
- 等宽：JetBrains Mono
- 中文：Noto Sans SC（本地 woff2 子集）
- 不引入商业字体文件；用近似替代并在验收中允许字体差异

### 6.2 参考组件 → 本站映射

| 参考站点组件 | 本站用途 |
| --- | --- |
| 顶部公告条 | `OPEN TO WORK` 求职状态条 |
| 透明粘性导航、Mega Menu | 主站/博客导航，移动端全屏菜单 |
| 超大 Hero + 渐变/噪点背景 | 主站首页、五个项目单页、博客 Hero |
| 横向 Marquee | 技术关键词、项目能力标签 |
| Stack Cards + 点进度 + 加号 | 技术栈横向固定滚动区 |
| Builders / Traders 双栏 | 项目大图展示的错位双栏 |
| Logo Wall | 技术栈图标墙（Remix Icon，不用图片 Logo） |
| 数字统计 | 经验/项目/文章/技术域计数 |
| Security 徽章区 | “工程习惯”区：单测、CI、性能、可访问性 |
| Ethos / Statement 大字 | 个人宣言 + 联系 CTA |
| 底部音频条 | 页脚装饰动画 |
| Divider Cube / 点线 | 全站分隔装饰 |
| 按钮 / 卡片 hover | CTA、项目卡、文章卡 |
| 折叠面板 | Canvas Web 权限说明、项目 FAQ |
| 标签切换 | 项目功能切换、技术栈分类 |
| 首屏/路由加载 | 自建全屏加载层与页面转场 |

### 6.3 动效系统

- **技术**：GSAP 3 + ScrollTrigger + Lenis；`gsap.context()` 管理每个组件的动画，卸载时 `revert()`。
- **首屏加载**：全屏遮罩 + 0→100 计数 + 站点标识揭示 + 分屏擦除，最长 1.2s；不阻塞内容。
- **页面切换**：Nuxt 路由钩子触发全屏遮罩/擦除，最长 600ms；保留浏览器前进后退与深链接。
- **滚动揭示**：标题按行/词拆分进入，图片遮罩上滑，卡片交错淡入。
- **固定横滚**：技术栈横向滚动、项目大图粘性面板；移动端降级为纵向。
- **跑马灯**：无限循环，滚动速度随滚动方向轻微变化。
- **数字计数**：进入视口后递增，支持千分位。
- **悬停**：图片缩放、箭头位移、按钮底色填充、链接下划线展开。
- **背景**：网格、噪点、径向光晕、节点连线；全部用 CSS/SVG 自绘，不使用参考站点素材。
- **可访问性**：`prefers-reduced-motion` 下关闭 Lenis、固定横滚与大幅位移；只保留淡入。
- **SSR 安全**：所有动画只在客户端注册；服务端渲染输出静态最终态，避免闪烁与位移。

### 6.4 图片与 SVG 占位策略

统一组件 `AssetFrame`：

- 1px 实线边框 + 四角十字标记 + 中心标签（如 `PROJECT VISUAL 16:9`）+ 推荐尺寸。
- 固定宽高比，避免布局抖动。
- 支持后续传入 `src` 直接替换；未传时保持空框。
- 主站所有需要图片、复杂插画、产品截图的位置一律使用它。
- 背景网格、噪点、光晕、节点连线、音频条、方块分隔等“背景/文字/小型装饰”由代码实现，不留空框。

占位清单（约 56 处）：

| 位置 | 数量 | 建议尺寸 |
| --- | --- | --- |
| 首页 Hero 人像/视觉 | 1 | 4:5，1200×1500 |
| 首页精选项目大图 | 4 | 16:9，1920×1080，最小高度 50vh |
| 项目列表六个项目大图 | 6 | 同上，与首页不共用图片 |
| 关于页人像 | 1 | 4:5 |
| NoteFlow Hero 视觉 | 1 | 16:10 |
| NoteFlow 功能/画廊 | 6 | 16:9 / 16:10 |
| Canvas Web Hero 视觉 | 1 | 16:10 |
| Canvas Web 功能/画廊 | 6 | 16:9 / 16:10 |
| 芒果表单 Hero 视觉 | 1 | 16:10 |
| 芒果表单功能/画廊 | 6 | 16:9 / 16:10 |
| 星光 Hero 视觉 | 1 | 16:10 |
| 星光功能/画廊 | 6 | 16:9 / 16:10 |
| 掌上莆院 Hero 视觉 | 1 | 16:10 |
| 掌上莆院功能/画廊 | 6 | 16:9 / 16:10 |
| 8 个分类封面 | 8 | 16:10，1600×1000（CMS 上传，缺省时显示空框） |
| 默认 OG 图 | 1 | 1200×630 |

### 6.5 图标

- 统一 `@remixicon/vue`。
- 导航、按钮、社交、标签、搜索、RSS、评论、CMS 操作全部使用 Remix Icon。
- 不引入 iconfont、不下载图片图标。

### 6.6 避免同页重复组件

设计评审时按页面检查：

| 页面 | 版式区分策略 |
| --- | --- |
| 首页 | 项目区用粘性全幅/错位/横滑/编号覆盖四种；技术栈用固定横滚；文章用编号行；关于用分屏；宣言用居中大字 |
| 项目列表 | 六个编辑式区块方向与构图交替，不使用统一卡片 |
| 关于 | 分屏 Hero、时间轴、技能矩阵、横条、下载条，各不同 |
| 博客首页 | 特写大图 + 分类横条 + 编号列表，不出现三列等宽卡片 |
| 文章页 | 封面 Hero、正文双栏、上下篇分屏、相关横向滚动 |
| 分类/标签/归档 | 分别使用错落封面、文字云、粘性年份时间轴 |

---

## 7. 数据模型

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `User` | `username`、`passwordHash`、`createdAt` | 仅 1 条，seed 生成 |
| `Post` | `slug`、`lang`、`title`、`titleColor`、`excerpt`、`contentMd`、`categoryId`、`status`、`publishedAt`、`updatedAt` | `@@unique([lang, slug])`；`titleColor` 默认 `#EFEFEB`；`status = draft/published` |
| `Category` | `slug`、`nameZh`、`nameEn`、`descZh`、`descEn`、`imagePath` | slug 全站唯一且创建后锁定 |
| `Tag` | `slugZh`、`slugEn`、`nameZh`、`nameEn` | 中英文标签各自保留旧 slug |
| `PostTag` | `postId`、`tagId` | 多对多 |
| `Comment` | `postId`、`nickname`、`emailHash`、`content`、`status`、`ipHash`、`createdAt` | 只存邮箱哈希；`status = visible/hidden`；默认 visible |
| `Media` | `path`、`mime`、`size`、`width`、`height` | 分类封面、文章内图片 |
| `Redirect`（可选） | `fromPath`、`toPath`、`statusCode` | 用于后续 slug 变更补 301；一期可不启用 |

约定：

- 文章封面不存在独立字段；列表/详情封面 = `Category.imagePath` + `Post.title` 叠字 + `Post.titleColor`。
- 分类无图时显示 `AssetFrame`，不生成默认封面图。
- slug 创建后锁定；CMS 明确提示“修改会导致旧链接失效”。
- 标题颜色校验 `#RGB` / `#RRGGBB`，CMS 提供取色器与预览。
- 中文标签 slug 存储解码后的真实字符，路由参数解码后匹配，输出链接时再编码。

---

## 8. CMS 与评论

### 8.1 单账户认证

- seed 时用环境变量创建唯一管理员；无注册入口。
- 登录：`POST /api/admin/login`，bcrypt 校验，签发密封会话 Cookie。
- Cookie：httpOnly、secure、sameSite=lax、7 天。
- `/api/admin/**` 未登录返回 401；`/admin/**` 页面重定向登录。
- 登录失败限流；写操作校验 `Origin`，防 CSRF。
- 退出：清除会话。

### 8.2 文章编辑器

Nuxt UI 没有现成 Markdown 编辑器，采用自建：

- 左：`UTextarea`（等宽字体、行号可选）+ 工具栏（标题、粗体、链接、代码、图片上传、预览）
- 右：实时预览，复用服务端同一渲染器
- 元信息侧栏：语言、标题、slug、分类、标签、摘要、发布日期、状态、标题颜色
- 图片：上传后插入 Markdown，落盘 `/data/uploads/`
- 自动保存草稿；发布后清理文章/列表缓存
- slug 自动生成但默认锁定；发布后只读
- 支持中英文两篇文章独立编辑，可按 slug 跳转对应译文

### 8.3 分类

- 名称（中/英）、slug、描述、封面图上传、预览。
- 封面图必须为栅格图（JPG/PNG/WebP/AVIF），拒绝 SVG 上传，避免脚本注入。
- 分类删除前检查关联文章，默认禁止删除；需先迁移文章。

### 8.4 评论

- 读者无需登录。
- 字段：昵称（必填）、邮箱（选填）、内容（2–2000 字）。
- 头像：`MD5(trim(lower(email))` → Gravatar `https://www.gravatar.com/avatar/{hash}?s=96&d=mp`；无邮箱时用 Remix 用户图标。
- API 不返回邮箱或邮箱哈希，只返回 `avatarUrl`。
- 内容按纯文本处理，转义后保留换行并安全 linkify；不渲染任意 HTML。
- 提交校验：
  1. Turnstile token 必须存在；
  2. 服务端 `siteverify` 校验成功；
  3. 蜜罐字段为空、提交耗时大于阈值；
  4. 同 IP 限流（如 3 次/分钟）。
- 通过后立即写入并返回，默认 `visible`；CMS 可隐藏/删除。
- 评论列表按时间正序；文章页显示总数。

### 8.5 上传与存储

- 目录：`/data/uploads/YYYY/MM/{uuid}.{ext}`，Docker volume 持久化。
- 单文件上限 8MB；服务端 `sharp` 压缩，最长边 1920。
- 对外路由 `/uploads/**`，长缓存；禁止目录遍历。
- CMS 上传接口仅管理员可用。

---

## 9. 阶段计划、验收标准与单测

> 阶段之间有依赖：P0 → P1 → P2/P3；P0/P1 → P4；P4 → P5；P2/P3/P5 → P6；P6 → P7。

### P0 基座与设计系统

**工作内容**

- Nuxt 4 + TypeScript + Nuxt UI 4 + Tailwind 初始化。
- ESLint、Prettier、Vitest、类型检查、CI 脚本。
- 设计令牌、字体、Remix Icon、基础组件：按钮、分隔、Marquee、AssetFrame、SectionHeading、Counter。
- Host 分流中间件骨架、两站点路由骨架、404。
- Docker 开发环境与 PostgreSQL 连接。

**交付物**

- 可运行的双域名骨架、设计令牌文件、基础组件库、测试框架。

**验收标准**

- `pnpm dev` 下 `localhost:3000` 为 www、`blog.localhost:3000` 为 blog。
- `pnpm lint`、`pnpm typecheck`、`pnpm test` 全部通过。
- 基础组件在亮/暗背景均无控制台报错；字体无 FOIT/CLS。
- `AssetFrame` 支持固定比例、标签、尺寸提示。

**单测**

- Host 解析与站点判定（端口、大小写、未知 Host）。
- 环境变量校验（缺失数据库/会话密钥时启动失败）。
- 占位清单注册表：id 唯一、比例合法、必填字段完整。

### P1 数据层与内容迁移

**工作内容**

- Prisma schema、迁移、seed 管理员。
- 旧站内容获取：
  - 优先使用 Hugo 源仓库；
  - 若无源码，按 sitemap 抓取 46 篇文章页面，HTML → Markdown。
- 迁移 23 篇中文 + 23 篇英文、8 个分类、中英各 16 个标签。
- 文章内图片保持原有外链，不下载、不本地化、不重写路径。
- 生成迁移报告：URL、slug、标题、日期、分类、标签。

**交付物**

- 数据库可重放的 seed/import 脚本、迁移报告、内容差异清单。

**验收标准**

- 文章数 23/23，分类 8，标签 16/16，slug 与旧站 100% 一致。
- 文章标题、日期、分类、标签、语言全部匹配。
- 抽检 5 篇渲染文本与旧站差异可接受，代码块数量一致。
- 分页每页 5 篇，总页数 5。

**单测**

- HTML → Markdown 转换（固定样例快照）。
- 元信息解析（日期、分类、标签、阅读时长）。
- slug 规范化与中文标签解码/编码。
- 图片路径重写与去重。
- 导入幂等：重复执行不产生重复文章。
- 分类/标签映射表完整性。

### P2 博客功能与旧 URL 对齐（功能壳）

**工作内容**

- 博客首页、分页、文章详情、分类、标签、归档、搜索、友链、`/post/`、`/page/`。
- `/en/**` 全部镜像路由。
- 手动语言词典、语言切换、hreflang。
- `/index.xml`、`/en/index.xml`、`/index.md`、`/en/index.md`。
- `/sitemap.xml`、`/zh-cn/sitemap.xml`、`/en/sitemap.xml`。
- `/search/index.json` 兼容接口与搜索 API。
- 文章 TOC、代码高亮、代码复制。
- 旧地址重定向矩阵。
- 此时只做可用性与结构，视觉在 P4 完成。

**交付物**

- 完整可访问的博客只读站；URL 验证脚本与报告。

**验收标准**

- 110 条 sitemap URL + 分页 + 特殊页 + Markdown/RSS/搜索索引全部 200 或预期 301。
- `/blog` 301 到 blog 首页；跨域路径 301 正确；无重定向环。
- 带/不带尾斜杠均 200，canonical 带斜杠。
- 每页 5 篇；分类/标签计数正确。
- TOC 层级与文章标题一致；代码块可复制。
- RSS XML 校验通过；sitemap 结构与旧站一致。
- `/search/?keyword=` 能命中标题与正文；`/search/index.json` 字段与旧结构兼容。
- 无 404（仅页面地址；图片等资源不在验收范围）。

**单测**

- 旧 URL → 新 URL 映射、跨域 301、query 保留、防环。
- 分页边界（第 1 页、最后一页、越界页）。
- TOC 提取、锚点去重、中文标题。
- RSS：条目数量、绝对链接、XML 转义、语言过滤。
- sitemap：每语言 55 条、尾斜杠、排除草稿。
- 搜索：关键词清洗、最短长度、语言过滤、空结果、SQL 注入字符。
- 语言路由：`/en/...` 判定、翻译缺失时的回退与 hreflang。
- Markdown 安全：脚本标签、`onerror`、危险链接被清理。

### P3 CMS 与评论

**工作内容**

- 登录、会话、管理员守卫。
- 文章 CRUD、分类 CRUD、标签 CRUD、评论管理。
- Markdown 编辑器、预览、自动保存、图片上传。
- 分类封面上传与预览；文章标题颜色设置。
- Turnstile 评论提交、Gravatar、限流、XSS 防护。
- 缓存清理与发布后可见性。

**交付物**

- 可独立管理内容的 CMS；评论闭环。

**验收标准**

- 未登录访问 `/admin` 与任意 `/api/admin/**` 被拦截。
- 新建/编辑/删除文章后，前台 10 秒内更新（缓存清理生效）。
- 草稿不出现在前台、sitemap、RSS、搜索。
- slug 发布后锁定；重复 slug 被拒绝。
- 分类封面缺省显示 `AssetFrame`；有图时列表与详情显示“分类图 + 标题”，标题颜色生效。
- 评论无需登录即可提交并立即显示；Turnstile 失败时拒绝；限流生效。
- 评论显示 Gravatar 头像；接口响应不含邮箱/哈希。
- 隐藏/删除评论后前台立即消失。
- 上传非图片或 SVG 被拒绝；上传后重启容器文件仍存在。

**单测**

- 密码校验、会话签发、管理员守卫 401、登录限流、Origin 校验。
- Gravatar：trim/lowercase/MD5、无邮箱回退、非法邮箱。
- 评论校验：长度、空白、蜜罐、提交耗时、限流窗口。
- Turnstile：成功、失败、网络错误、缺失 token、超时。
- 评论内容转义与安全 linkify。
- 标题颜色：`#RGB`/`#RRGGBB`、非法值、对比度提示。
- slug 锁定与唯一性。
- 上传：MIME 白名单、扩展名伪装、大小限制、路径穿越、随机文件名。
- 分类删除前的关联检查。
- 缓存键生成与清理。

### P4 主站页面与全站视觉

**工作内容**

- 首页、项目列表、NoteFlow、Canvas Web、芒果表单、星光、掌上莆院、关于。
- 博客页面套用最终视觉与组件。
- 首页 4 个 / 项目页 6 个项目大图、分类封面叠字、AssetFrame 清单落地。
- 技术栈、最近项目、最近文章、统计、宣言、页脚。
- 响应式与可访问性基础。

**交付物**

- 两站点完整页面；占位清单；设计评审记录。

**验收标准**

- 页面内容按第 4 节版块顺序完整呈现。
- 首页 4 个、项目列表 6 个项目图高度 ≥ 50vh（桌面），图片框比例稳定无 CLS。
- 所有图片/复杂插画位置均为 `AssetFrame`，清单与实际页面一一对应。
- 图标全部 Remix Icon，无图片图标。
- 同页不存在两个外观相同的版块（按 6.6 检查表逐页签字）。
- 1440 / 1024 / 768 / 480 四档无横向溢出、无遮挡。
- 键盘可完成导航、菜单、搜索、评论；焦点可见；对比度达 AA。
- 五个项目单页 Hero 分别设计，且与首页 Hero、彼此之间均不同。
- `简历编辑器` 项目卡与关于页入口均指向 `blog.zhoujump.com/p/resume-tool-index/`。
- `掌上莆院` 总览卡可进入站内单页；单页无失效外链，仓库按钮为禁用占位。
- Canvas Web 仓库按钮为禁用占位并说明“仓库待补充”。

**单测**

- 占位清单与页面引用的完整性（防止漏图/重复 id）。
- 主站静态数据常量结构校验（项目、技术栈、履历字段）。
- SEO 标题/描述生成规则。
- 导航与项目链接映射（内部/外部/禁用按钮）。
- 无视觉单测；以设计评审 + 视觉回归截图为主。

### P5 动效系统

**工作内容**

- GSAP 客户端插件、ScrollTrigger、Lenis。
- 首屏加载层、页面切换转场。
- 滚动揭示、跑马灯、数字计数、固定横滚、悬停。
- 移动端与 reduced-motion 降级。
- 性能调优与内存清理。

**交付物**

- 全站动效层；动效参数表；降级策略。

**验收标准**

- 首屏加载 ≤ 1.2s 且可跳过；页面切换遮罩 ≤ 600ms。
- 前进/后退、锚点、深链接在转场下不丢失。
- 桌面滚动稳定 60fps；无长任务导致明显卡顿。
- `prefers-reduced-motion` 下无大幅位移、无固定横滚、无平滑滚动劫持。
- 移动端固定横滚降级为纵向，跑马灯降速。
- 动画卸载后无残留监听；路由反复切换无内存增长异常。
- 动画不改变首屏 LCP 元素与 CLS。

**单测**

- `prefersReducedMotion` 判定与配置开关。
- 动画参数表（时长、缓动、触发阈值）合法性。
- `useGsap` 上下文创建/销毁（DOM mock）。
- 首屏跳过逻辑（会话内重复加载）。
- 不做 GSAP 视觉结果断言。

### P6 SEO、迁移验收与部署

**工作内容**

- canonical、hreflang、OG、JSON-LD、robots、sitemap。
- 301 矩阵与旧 URL 验证脚本。
- Dockerfile、docker-compose、Nginx 双域名、TLS。
- 健康检查、备份、日志、环境变量。
- Lighthouse 与可访问性检查。

**交付物**

- 可部署镜像、部署说明、URL 验证报告、Lighthouse 报告。

**验收标准**

- 全部旧 URL：200 或单跳 301；404 数量 0。
- `/blog` 与 `/blog/*` 301 正确；无重定向环。
- 两站点 sitemap、robots、canonical 各自正确，不互相串站。
- 文章页 hreflang 与语言切换成对；翻译缺失时不出错误链接。
- JSON-LD 校验通过（Person、WebSite、BlogPosting）。
- 关键页 Lighthouse Performance/SEO/Accessibility ≥ 90。
- `docker compose up` 冷启动可用；重启后上传文件与数据库数据不丢。
- 备份可恢复演练通过。
- 404 页面返回 404 状态码且有导航与搜索入口。

**单测**

- 重定向映射与状态码。
- canonical/hreflang/OG/JSON-LD 生成器。
- robots 按 Host 输出。
- 环境变量与启动配置。
- 备份脚本路径/参数（纯函数部分）。

### P7 上线与观察

**工作内容**

- 降低 DNS TTL、切换解析、灰度验证、回滚预案。
- 提交搜索引擎 sitemap，观察 404/301 日志。
- 旧站快照保留。

**验收标准**

- 生产两域名 HTTPS 正常，证书有效。
- 切换后 24 小时 404 日志为 0（除已知无效外链）。
- 旧 RSS 订阅者仍可获取 `/index.xml`。
- 回滚可在不改代码的情况下恢复旧站。

---

## 10. 测试范围总表

### 10.1 必须写单测（Vitest）

| 模块 | 关键用例 | 优先级 |
| --- | --- | --- |
| URL / 重定向 | `/blog`、`/blog/*`、跨域、尾斜杠、query、防环 | P0 |
| Host 分流 | www/blog/未知 Host/端口/大小写 | P0 |
| 分页 | 每页 5、边界、越界、总数 | P0 |
| Markdown / TOC | 标题层级、锚点去重、代码块、XSS 清理 | P0 |
| 搜索 | 关键词清洗、语言过滤、空结果、注入字符 | P0 |
| RSS | 条目、绝对链接、XML 转义、语言 | P0 |
| Sitemap | 55/55、尾斜杠、草稿排除 | P0 |
| Gravatar | 哈希、大小写、无邮箱、非法邮箱 | P0 |
| 评论 | 长度、蜜罐、耗时、限流、转义、linkify | P0 |
| Turnstile | 成功/失败/网络错误/缺 token | P0 |
| 认证 | 密码、会话、401、登录限流、Origin | P0 |
| 上传 | MIME、伪装、大小、路径穿越 | P0 |
| 文章 | slug 锁定、草稿可见性、标题颜色、摘要/阅读时长 | P1 |
| 导入 | HTML→MD 快照、元信息、幂等、图片重写 | P1 |
| 语言 | `/en/` 判定、翻译缺失、hreflang | P1 |
| SEO | canonical/OG/JSON-LD/robots | P1 |
| 动效辅助 | reduced motion、参数表、上下文销毁 | P2 |

### 10.2 集成测试（可选，建议）

- 使用临时 PostgreSQL schema：唯一约束、级联删除、分类删除保护、评论写入。
- 使用 `@nuxt/test-utils` 调 API：登录 → 发布 → 前台可见 → 删除。

### 10.3 E2E（Playwright，发布门禁，不算单测）

- **迁移矩阵**：遍历 110 条旧 URL + 分页 + 特殊页 + 两种尾斜杠，断言 200/301。
- `/blog` 与 `/blog/*` 301 到 blog 域名。
- 搜索 `?keyword=` 结果非空。
- 语言切换 zh ↔ en。
- 管理员登录 → 新建文章 → 前台可见 → 删除。
- 评论：Turnstile 测试密钥下提交成功；失败 token 被拒绝。
- 页面切换后 URL、标题、内容一致；前进后退正常。
- 404 返回 404 状态。

### 10.4 不写单测

- GSAP 时间轴视觉结果、Lenis 滚动手感。
- CSS 布局、颜色、字体观感。
- Nuxt UI 内部组件行为。
- Webflow 参考站点的像素级对比。
- 以上用设计评审清单、截图回归、Lighthouse、人工动效验收替代。

---

## 11. 迁移、部署与回滚

### 11.1 内容迁移

1. 优先从 Hugo 源仓库导出 `content/`；若拿不到，按 sitemap 抓取。
2. 抓取文章正文、日期、分类、标签、语言、图片。
3. HTML → Markdown；代码块保留语言标记。
4. 图片下载到 `data/uploads/legacy/{slug}/`，重写 Markdown 路径。
5. 按 slug 写入 PostgreSQL；重复执行走 upsert，保持幂等。
6. 生成报告：URL、标题、日期、字数、图片数、分类、标签。
7. 抽检 5 篇中文 + 5 篇英文，人工比对。

### 11.2 部署

```
nginx (443, www + blog)
  └── app (Node, 3000)
        └── postgres (5432)
        └── volume: uploads, pgdata
```

环境变量：

| 变量 | 用途 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL 连接 |
| `SESSION_SECRET` | 会话密封密钥 |
| `ADMIN_USERNAME` | 管理员账号 |
| `ADMIN_PASSWORD_HASH` | 管理员 bcrypt 哈希 |
| `TURNSTILE_SITE_KEY` | 前端 Turnstile |
| `TURNSTILE_SECRET_KEY` | 服务端校验 |
| `UPLOAD_DIR` | 上传目录 |
| `SITE_WWW_URL` | `https://www.zhoujump.com` |
| `SITE_BLOG_URL` | `https://blog.zhoujump.com` |

部署检查：

- 健康检查 `/api/health`。
- Nginx 透传 `Host`。
- 数据库迁移在启动前执行。
- 上传目录挂载 volume。
- 备份：每日 `pg_dump` + 上传目录同步。

### 11.3 回滚

- 保留 version2 构建产物与旧站点快照。
- DNS 回切不需要改代码。
- 新库只写不删旧库；回滚期间旧评论仍可用（如未迁移）。

---

## 12. 风险与对策

| 风险 | 影响 | 对策 |
| --- | --- | --- |
| Twk Everett 为商业字体，不能直接使用 | 视觉并非 100% 一致 | 用 Inter Tight 近似；验收允许字体差异 |
| 参考站点素材/插画有版权 | 不能直接下载复用 | 只复用布局与动效模式；图片全部占位 |
| 编辑器无 Nuxt UI 现成组件 | 需要自建 | `UTextarea` + 工具栏 + 预览；必要时换 CodeMirror 6 |
| 单应用 Host 分流复杂 | 路由串站 | 中间件统一判定 + 路由映射单测 + E2E |
| 中英文标签 slug 不一致 | 链接错 | 标签存 `slugZh`/`slugEn`，解码后匹配 |
| 尾斜杠与 URL 编码 | 旧链 404/重复 | 两种形式都 200；canonical 带斜杠；标签编码单测 |
| Hugo 源码缺失 | 迁移质量下降 | 抓取 HTML + Turndown + 人工抽检；保留原文快照 |
| 分类图未及时提供 | 封面空白 | `AssetFrame` 兜底，不生成假图 |
| Turnstile 在开发环境不可用 | 无法评论 | 使用 Cloudflare 官方测试 key；生产强制校验 |
| GSAP/Lenis 与 SSR、粘性布局冲突 | 闪烁/卡顿 | 仅客户端注册；`gsap.context` 清理；移动端降级 |
| 上传目录未挂载 | 重启丢图 | Docker volume + 部署检查 |
| 旧评论未迁移 | 历史讨论丢失 | 列为可选项；如需要，用 Artalk 导出脚本 |

---

## 13. Slogan 与待确认项

### 13.1 Slogan 候选

1. **`MAKE IT RUN / 让想法跑起来`**（推荐：短、动作导向、适合作品集）
2. `SHIP. LEARN. REPEAT. / 交付、学习、重复`
3. `CODE & BUILD / 写代码，造东西`

原句“我们所度过的每个平凡的日常，也许就是连续发生的奇迹。”全站移除。

### 13.2 需要你确认

1. **Slogan** 是否采用推荐项。
2. **编辑器**：确认 Nuxt UI 无自带 Markdown 编辑器，采用“自建分屏编辑器”（推荐），还是引入第三方 `md-editor-v3` / CodeMirror 6。
3. **主题**：是否只做深色（推荐，贴合参考站点），还是保留旧站亮/暗切换。
4. **重点项目**是否为 芒果表单、Canvas Web、星光跨境营销、NoteFlow、简历编辑器、掌上莆院 六项（前四项与掌上莆院做单页，简历编辑器链接博客）。
5. **Hugo 源码**是否可提供；若不可，按线上抓取迁移。
6. **旧 Artalk 评论**是否需要迁移。
7. **CORS/管理入口**：CMS 放在 `www.zhoujump.com/admin`（推荐）还是 `blog.zhoujump.com/admin`。
8. 旧站文章页的 **CC BY-NC-SA 4.0 版权声明**是否保留。

确认后再进入 P0 编码。
