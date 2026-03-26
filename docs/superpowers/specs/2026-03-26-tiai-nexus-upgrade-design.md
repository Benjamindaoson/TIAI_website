# TIAI-Nexus 升级设计规范

**日期**：2026-03-26
**状态**：已批准（v3）
**作者**：Claude Sonnet 4.6（与用户协作）

---

## 背景与目标

TIAI-Nexus 目前是一个双语（中英文）机构展示网站，使用 Next.js 16 App Router + next-intl + Tailwind CSS v4，部署在 Cloudflare Pages 上。网站功能仅限于静态内容展示，缺乏：

- 用户交互入口（申请/联系表单）
- 课程详情深度内容
- 博客/新闻系统

本次升级目标：在不改变现有技术栈和部署架构的前提下，增加以上三项功能。

---

## 选定方案：纯静态增强（方案 A）

保持 Next.js 静态/SSG 架构，用 MDX 文件驱动博客，课程页内容写入 i18n JSON，表单通过 Resend（邮件）+ Airtable REST API（数据持久化）处理。

**不引入**：后端服务器、数据库、CMS 系统。

### 运行时声明

`app/api/contact/route.ts` 必须声明 Edge Runtime：

```ts
export const runtime = 'edge'
```

Cloudflare Pages 使用 `@cloudflare/next-on-pages` 适配器，Node.js API Route 在 Edge 环境下无法运行。`airtable` npm 包依赖 Node.js 原生模块，**不兼容 Edge Runtime**，因此 Airtable 集成改用官方 REST API（`fetch()`）直接调用，无需安装 `airtable` 包。

### Middleware 确认

`src/middleware.ts`（或 `src/proxy.ts`）必须覆盖新路由前缀，确保 locale 路由正常工作：

```ts
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
```

新增路由 `/programs/:path*` 和 `/blog/:path*` 已被上述 matcher 覆盖，实现前需验证。

---

## 架构总览

```
TIAI-Nexus（升级后）
├── 现有内容（保持不变）
│   └── app/[lang]/page.tsx
│
├── 新增：课程详情页
│   └── app/[lang]/programs/
│       ├── ai-ml/page.tsx
│       ├── cs/page.tsx
│       └── information-systems/page.tsx
│
├── 新增：博客/新闻系统
│   ├── content/posts/           — MDX 文章文件
│   ├── app/[lang]/blog/
│   │   ├── page.tsx             — 文章列表
│   │   └── [slug]/page.tsx      — 文章详情
│   └── src/lib/mdx.ts           — MDX 工具函数
│
├── 新增：申请/联系表单
│   ├── app/api/contact/route.ts — API Route
│   └── src/components/ContactForm.tsx
│
└── 新增：环境变量
    ├── RESEND_API_KEY
    ├── AIRTABLE_API_KEY
    ├── AIRTABLE_BASE_ID
    ├── AIRTABLE_TABLE_NAME
    └── ADMIN_EMAIL
```

---

## 功能一：课程详情页

### URL 结构

| 语言 | AI/ML | CS | 信息系统 |
|------|-------|----|----------|
| 英文 | `/en/programs/ai-ml` | `/en/programs/cs` | `/en/programs/information-systems` |
| 中文 | `/zh/programs/ai-ml` | `/zh/programs/cs` | `/zh/programs/information-systems` |

### 页面模块（每个课程页）

1. **Hero** — 课程名称、一句话描述、CTA 按钮（立即申请）
2. **课程概述** — 培养目标、适合人群
3. **课程模块列表** — 核心课程 + 选修课（卡片布局）
4. **学习成果** — 毕业后能力（图标 + 文字）
5. **申请要求** — 入学条件、语言要求
6. **申请入口** — 内嵌 ContactForm

### 内容管理

内容写入 `messages/en.json` 和 `messages/zh.json`，与现有 i18n 架构保持一致，不引入 MDX。

---

## 功能二：博客/新闻系统

### 文件结构

```
content/posts/
├── 2026-01-01-example-post.en.mdx
├── 2026-01-01-example-post.zh.mdx
└── ...
```

### Frontmatter 规范

```yaml
---
title: "文章标题"
date: "2026-01-01"
author: "TIAI Editorial"
tags: ["announcement", "AI"]
excerpt: "显示在列表页的摘要"
---
```

### 路由

| 路由 | 说明 |
|------|------|
| `/[lang]/blog` | 文章列表页（卡片式，按时间倒序） |
| `/[lang]/blog/[slug]` | 文章详情页（MDX 渲染） |

### 技术依赖

- `gray-matter` — 解析 frontmatter
- `next-mdx-remote/rsc` — 渲染 MDX 内容（React Server Component 变体，适配 Next.js 16 App Router）
- 构建时静态生成（`generateStaticParams`），SEO 友好

### Slug 规则

文件名格式：`YYYY-MM-DD-slug.{lang}.mdx`

Slug 提取算法：
1. 去掉扩展名（`.mdx`）
2. 去掉语言后缀（`.en` / `.zh`）
3. 去掉开头的日期前缀（`YYYY-MM-DD-`）
4. 剩余部分即为 URL slug（如 `example-post`）

示例：`2026-01-01-ai-education-launch.zh.mdx` → slug = `ai-education-launch`

### i18n 回退策略

当某篇文章只有英文版（无对应 `.zh.mdx`）时，中文页面显示英文内容并在文章顶部展示提示 banner：

- 中文：「本文暂无中文版本，显示英文原文。」
- 英文：「This article is not available in your language. Showing English version.」

文章列表页仅显示当前语言已有译文的文章；无译文的文章不在列表中出现。

---

## 功能三：申请/联系表单

### 表单字段

| 字段 | 类型 | 必填 |
|------|------|------|
| 姓名 | text | 是 |
| 邮箱 | email | 是 |
| 电话 | tel | 否 |
| 意向项目 | select | 是 |
| 提交类型 | hidden | 是 |
| 消息内容 | textarea | 是 |

**意向项目选项**：AI/ML、Computer Science、Information Systems、合作洽谈、教职申请、其他

**提交类型**：`admission`（入学咨询）、`faculty`（教职申请）、`partnership`（合作洽谈）

### API Route 逻辑（`app/api/contact/route.ts`）

```ts
export const runtime = 'edge'

// POST /api/contact
// 1. Zod 校验请求体
// 2. 调用 Resend API（Edge 兼容）→ 发邮件通知管理员
// 3. 使用 fetch() 调用 Airtable REST API → 写入一条记录
//    POST https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}
//    Authorization: Bearer {AIRTABLE_API_KEY}
// 4. 返回 { success: true } 或错误信息
```

**Rate Limiting**：Cloudflare Pages 免费层不含内置 WAF Rate Limiting。可在 Cloudflare Dashboard 的「Security → WAF → Rate Limiting Rules」中手动配置（需 Pro 计划），或在 API Route 内用 IP + 时间窗口简单限流作为补充。

### Airtable 表结构

| 字段名 | 类型 |
|--------|------|
| Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Program | Single select |
| Type | Single select |
| Message | Long text |
| Submitted At | Date |
| Lang | Single line text |

### 安全

- 所有 API Key 存环境变量，不暴露客户端
- 服务端 Zod 校验防止恶意输入
- Cloudflare WAF 提供基础 Rate Limiting

---

## 新增依赖

```bash
npm install gray-matter next-mdx-remote resend zod
```

> **注意**：不安装 `airtable` 包（不兼容 Edge Runtime）。Airtable 通过 REST API + `fetch()` 直接调用。

---

## 环境变量

```env
# 已有
NEXT_PUBLIC_SITE_URL=https://texasinstituteofai.org

# 新增
RESEND_API_KEY=re_xxxxxxxxxxxx
AIRTABLE_API_KEY=patxxxxxxxxxxxx
AIRTABLE_BASE_ID=appxxxxxxxxxxxx
AIRTABLE_TABLE_NAME=Contacts
ADMIN_EMAIL=admin@texasinstituteofai.org
```

---

## 不在本次范围内

- CMS 系统（Sanity/Contentful）
- 后台管理面板
- 用户认证
- 教师/顾问独立页面（后续迭代）
- 学生案例展示（后续迭代）

---

## 交付检查清单

- [ ] 确认 `src/middleware.ts`（或 `src/proxy.ts`）matcher 覆盖 `/programs` 和 `/blog` 前缀
- [ ] 三个课程详情页（EN + ZH），JSON key 命名规范：`programs.{slug}.{section}.{field}`
- [ ] 博客列表页 + 文章详情页（EN + ZH）
- [ ] `content/posts/` 目录 + 至少 1 篇示例文章（双语 MDX）
- [ ] ContactForm 组件（含 i18n，支持中英切换）
- [ ] `/api/contact` API Route（`runtime = 'edge'`，Zod + Resend + Airtable REST API）
- [ ] `.env.example` 更新（含 `AIRTABLE_TABLE_NAME`、`ADMIN_EMAIL`）
- [ ] Header 导航新增 Programs 和 Blog 链接
- [ ] sitemap.ts 更新（包含新页面）
- [ ] 验证 `next.config.ts` 构建模式与 `@cloudflare/next-on-pages` 兼容性
