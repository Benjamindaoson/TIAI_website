# TIAI-Nexus Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add course detail pages, a bilingual MDX blog system, and an Edge-compatible contact form (Resend + Airtable REST API) to the existing TIAI-Nexus Next.js site.

**Architecture:** Static/SSG Next.js 16 App Router with next-intl for EN/ZH i18n. Blog content is MDX files read at build time via `gray-matter` + `next-mdx-remote/rsc`. Course content is added to existing `messages/*.json` i18n files. The contact form posts to an Edge Runtime API route that calls Resend and Airtable REST APIs directly via `fetch()`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, next-intl, gray-matter, next-mdx-remote, resend, zod, Cloudflare Pages (`@cloudflare/next-on-pages`)

---

## File Map

### New Files
- `content/posts/2026-03-26-welcome.en.mdx` — sample English blog post
- `content/posts/2026-03-26-welcome.zh.mdx` — sample Chinese blog post
- `src/lib/mdx.ts` — MDX file reading + frontmatter parsing utilities
- `src/app/[lang]/blog/page.tsx` — blog list page
- `src/app/[lang]/blog/[slug]/page.tsx` — blog detail page
- `src/app/[lang]/programs/ai-ml/page.tsx` — AI/ML course detail page
- `src/app/[lang]/programs/cs/page.tsx` — CS course detail page
- `src/app/[lang]/programs/information-systems/page.tsx` — IS course detail page
- `src/components/ContactForm.tsx` — bilingual contact/application form
- `src/app/api/contact/route.ts` — Edge Runtime API route (Zod + Resend + Airtable)

### Modified Files
- `messages/en.json` — add Navigation.blog, Navigation.programsNav, Programs.* course content keys
- `messages/zh.json` — same keys in Chinese
- `src/components/Header.tsx` — add Blog and Programs nav links
- `src/app/sitemap.ts` — add course pages and blog pages
- `.env.example` — add RESEND_API_KEY, AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME, ADMIN_EMAIL

---

## Task 1: Install Dependencies & Verify Middleware

**Files:**
- Verify: `src/proxy.ts`
- Modify: `package.json` (via npm)
- Modify: `.env.example`

- [ ] **Step 1: Verify middleware matcher covers new routes**

  Open `src/proxy.ts`. Confirm matcher is `/(zh|en)/:path*` — this already covers `/en/blog/*` and `/en/programs/*`. No change needed.

- [ ] **Step 2: Install new dependencies**

  ```bash
  cd D:/TIAI-Nexus
  npm install gray-matter next-mdx-remote resend zod
  npm install --save-dev @types/mdx
  ```

  Expected: packages added to `package.json`, no peer dependency errors.

- [ ] **Step 3: Update `.env.example`**

  Add to `.env.example`:
  ```env
  RESEND_API_KEY=re_xxxxxxxxxxxx
  AIRTABLE_API_KEY=patxxxxxxxxxxxx
  AIRTABLE_BASE_ID=appxxxxxxxxxxxx
  AIRTABLE_TABLE_NAME=Contacts
  ADMIN_EMAIL=admin@texasinstituteofai.org
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add package.json package-lock.json .env.example
  git commit -m "chore: install gray-matter, next-mdx-remote, resend, zod"
  ```

---

## Task 2: MDX Utility Library

**Files:**
- Create: `src/lib/mdx.ts`

- [ ] **Step 1: Create `src/lib/mdx.ts`**

  ```ts
  import fs from 'fs'
  import path from 'path'
  import matter from 'gray-matter'

  const postsDir = path.join(process.cwd(), 'content/posts')

  export interface PostMeta {
    slug: string
    title: string
    date: string
    author: string
    tags: string[]
    excerpt: string
    lang: string
  }

  export interface Post extends PostMeta {
    content: string
  }

  function parseFilename(filename: string): { slug: string; lang: string } | null {
    // Format: YYYY-MM-DD-slug.lang.mdx
    const match = filename.match(/^\d{4}-\d{2}-\d{2}-(.+)\.(en|zh)\.mdx$/)
    if (!match) return null
    return { slug: match[1], lang: match[2] }
  }

  export function getAllPostMeta(lang: string): PostMeta[] {
    const files = fs.readdirSync(postsDir)
    return files
      .map((filename) => {
        const parsed = parseFilename(filename)
        if (!parsed || parsed.lang !== lang) return null
        const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
        const { data } = matter(raw)
        return {
          slug: parsed.slug,
          lang: parsed.lang,
          title: data.title ?? '',
          date: data.date ?? '',
          author: data.author ?? '',
          tags: data.tags ?? [],
          excerpt: data.excerpt ?? '',
        } satisfies PostMeta
      })
      .filter((p): p is PostMeta => p !== null)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  export function getPost(slug: string, lang: string): Post | null {
    const filename = fs.readdirSync(postsDir).find((f) => {
      const parsed = parseFilename(f)
      return parsed?.slug === slug && parsed?.lang === lang
    })
    if (!filename) return null
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug,
      lang,
      content,
      title: data.title ?? '',
      date: data.date ?? '',
      author: data.author ?? '',
      tags: data.tags ?? [],
      excerpt: data.excerpt ?? '',
    }
  }

  export function getAllSlugs(): { slug: string; lang: string }[] {
    return fs
      .readdirSync(postsDir)
      .map(parseFilename)
      .filter((p): p is { slug: string; lang: string } => p !== null)
  }
  ```

- [ ] **Step 2: Create sample posts directory and posts**

  Create `content/posts/2026-03-26-welcome.en.mdx`:
  ```mdx
  ---
  title: "Welcome to TIAI"
  date: "2026-03-26"
  author: "TIAI Editorial"
  tags: ["announcement"]
  excerpt: "Texas Institute of Artificial Intelligence officially launches its education programs."
  ---

  # Welcome to TIAI

  Texas Institute of Artificial Intelligence is proud to launch its bilingual AI education programs in partnership with accredited U.S. institutions.
  ```

  Create `content/posts/2026-03-26-welcome.zh.mdx`:
  ```mdx
  ---
  title: "欢迎来到 TIAI"
  date: "2026-03-26"
  author: "TIAI 编辑部"
  tags: ["公告"]
  excerpt: "德州人工智能学院正式启动 AI 教育项目。"
  ---

  # 欢迎来到 TIAI

  德州人工智能学院很高兴与美国认可院校合作，正式推出双语 AI 教育项目。
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/lib/mdx.ts content/
  git commit -m "feat: add MDX utility library and sample blog posts"
  ```

---

## Task 3: Blog List Page

**Files:**
- Create: `src/app/[lang]/blog/page.tsx`

- [ ] **Step 1: Create blog list page**

  ```tsx
  // src/app/[lang]/blog/page.tsx
  import { getAllPostMeta } from '@/lib/mdx'
  import { getTranslations } from 'next-intl/server'
  import Link from 'next/link'

  export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const t = await getTranslations('Blog')
    const posts = getAllPostMeta(lang)

    return (
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">{t('title')}</h1>
        <p className="text-slate-400 mb-12">{t('subtitle')}</p>
        {posts.length === 0 ? (
          <p className="text-slate-500">{t('empty')}</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border border-slate-800 rounded-lg p-6 hover:border-slate-600 transition-colors">
                <time className="text-sm text-slate-500">{post.date}</time>
                <h2 className="text-xl font-semibold text-slate-100 mt-1 mb-2">
                  <Link href={`/${lang}/blog/${post.slug}`} className="hover:text-blue-400 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-400 text-sm">{post.excerpt}</p>
                <div className="mt-3 flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    )
  }
  ```

- [ ] **Step 2: Add Blog i18n keys to `messages/en.json`**

  Under the top-level JSON, add:
  ```json
  "Blog": {
    "title": "News & Insights",
    "subtitle": "Updates, research, and announcements from TIAI.",
    "empty": "No posts available yet. Check back soon.",
    "readMore": "Read more",
    "fallbackBanner": "This article is not available in your language. Showing English version."
  }
  ```

- [ ] **Step 3: Add Blog i18n keys to `messages/zh.json`**

  ```json
  "Blog": {
    "title": "新闻与洞察",
    "subtitle": "来自 TIAI 的最新动态、研究成果与公告。",
    "empty": "暂无文章，敬请期待。",
    "readMore": "阅读更多",
    "fallbackBanner": "本文暂无中文版本，显示英文原文。"
  }
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/[lang]/blog/page.tsx messages/
  git commit -m "feat: add blog list page with i18n"
  ```

---

## Task 4: Blog Detail Page

**Files:**
- Create: `src/app/[lang]/blog/[slug]/page.tsx`

- [ ] **Step 1: Create blog detail page**

  ```tsx
  // src/app/[lang]/blog/[slug]/page.tsx
  import { getPost, getAllSlugs, getAllPostMeta } from '@/lib/mdx'
  import { MDXRemote } from 'next-mdx-remote/rsc'
  import { getTranslations } from 'next-intl/server'
  import { notFound } from 'next/navigation'
  import Link from 'next/link'

  export async function generateStaticParams() {
    return getAllSlugs()
  }

  export default async function BlogPostPage({
    params,
  }: {
    params: Promise<{ lang: string; slug: string }>
  }) {
    const { lang, slug } = await params
    const t = await getTranslations('Blog')

    let post = getPost(slug, lang)
    let isFallback = false

    if (!post && lang === 'zh') {
      post = getPost(slug, 'en')
      isFallback = true
    }

    if (!post) notFound()

    return (
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        {isFallback && (
          <div className="mb-6 px-4 py-3 rounded bg-yellow-900/30 border border-yellow-700 text-yellow-300 text-sm">
            {t('fallbackBanner')}
          </div>
        )}
        <Link href={`/${lang}/blog`} className="text-sm text-slate-400 hover:text-slate-200 mb-8 inline-block">
          ← {lang === 'zh' ? '返回列表' : 'Back to News'}
        </Link>
        <time className="text-sm text-slate-500">{post.date}</time>
        <h1 className="text-4xl font-bold text-slate-100 mt-2 mb-4">{post.title}</h1>
        <p className="text-slate-400 text-sm mb-8">By {post.author}</p>
        <div className="prose prose-invert prose-slate max-w-none">
          <MDXRemote source={post.content} />
        </div>
      </article>
    )
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/app/[lang]/blog/[slug]/page.tsx
  git commit -m "feat: add blog detail page with MDX rendering and i18n fallback"
  ```

---

## Task 5: Course i18n Content

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

- [ ] **Step 1: Add course content keys to `messages/en.json`**

  Add a top-level `"Programs"` key with this structure for all three programs:

  ```json
  "Programs": {
    "ai-ml": {
      "hero": { "title": "Artificial Intelligence & Machine Learning", "tagline": "From foundations to deployment: modern AI methods, model systems, and applied practice.", "cta": "Apply Now" },
      "overview": { "title": "Program Overview", "goal": "Prepare students for careers in AI engineering, data science, and ML operations.", "audience": "International students seeking a U.S. transfer pathway with a focus on AI careers." },
      "courses": { "title": "Curriculum", "core": ["Introduction to Machine Learning", "Deep Learning & Neural Networks", "Natural Language Processing", "Computer Vision", "MLOps & Model Deployment"], "electives": ["Reinforcement Learning", "AI Ethics & Policy", "Applied Statistics"] },
      "outcomes": { "title": "Learning Outcomes", "items": ["Build and deploy production ML models", "Work with real-world datasets at scale", "Apply AI to solve domain-specific problems", "Contribute to open-source AI projects"] },
      "requirements": { "title": "Admission Requirements", "items": ["Bachelor's degree or equivalent", "English proficiency (TOEFL 80+ or IELTS 6.5+)", "Basic programming experience (Python preferred)"] }
    },
    "cs": {
      "hero": { "title": "Computer Science & Software Engineering", "tagline": "Transfer-aligned CS curriculum including algorithms, systems, and engineering methods.", "cta": "Apply Now" },
      "overview": { "title": "Program Overview", "goal": "Build foundational CS competency aligned to U.S. university transfer requirements.", "audience": "Students seeking accredited U.S. CS credits through structured 2+2 transfer pathways." },
      "courses": { "title": "Curriculum", "core": ["Data Structures & Algorithms", "Operating Systems", "Computer Networks", "Software Engineering", "Database Systems"], "electives": ["Cloud Computing", "Cybersecurity Fundamentals", "Mobile App Development"] },
      "outcomes": { "title": "Learning Outcomes", "items": ["Design and implement scalable software systems", "Apply core CS theory to engineering problems", "Collaborate in agile development teams", "Prepare for U.S. transfer or employment"] },
      "requirements": { "title": "Admission Requirements", "items": ["High school diploma or equivalent", "English proficiency (TOEFL 70+ or IELTS 6.0+)", "Mathematics background (calculus recommended)"] }
    },
    "information-systems": {
      "hero": { "title": "Information Systems", "tagline": "Business-aligned IS education connecting technology, data, and organizational needs.", "cta": "Apply Now" },
      "overview": { "title": "Program Overview", "goal": "Develop IS professionals who can bridge technical and business domains.", "audience": "Students targeting careers in IT management, data analytics, or enterprise systems." },
      "courses": { "title": "Curriculum", "core": ["Information Systems Analysis", "Database Management", "Business Intelligence & Analytics", "IT Project Management", "Enterprise Systems (ERP/CRM)"], "electives": ["Data Visualization", "Digital Transformation", "Information Security Management"] },
      "outcomes": { "title": "Learning Outcomes", "items": ["Analyze and design information systems for organizations", "Apply data analytics to business decisions", "Manage IT projects using industry frameworks", "Communicate technical concepts to non-technical stakeholders"] },
      "requirements": { "title": "Admission Requirements", "items": ["Bachelor's degree or equivalent", "English proficiency (TOEFL 75+ or IELTS 6.0+)", "Basic familiarity with spreadsheets or databases"] }
    }
  }
  ```

- [ ] **Step 2: Add same structure to `messages/zh.json`** (translate all values to Chinese)

  Key structure is identical, values translated:
  - `ai-ml.hero.title`: `"人工智能与机器学习"`
  - `ai-ml.hero.tagline`: `"从基础到部署：现代 AI 方法、模型系统与应用实践。"`
  - `cs.hero.title`: `"计算机科学与软件工程"`
  - `information-systems.hero.title`: `"信息系统"`
  - (translate all other fields accordingly)

- [ ] **Step 3: Commit**

  ```bash
  git add messages/
  git commit -m "feat: add course content i18n keys for all three programs"
  ```

---

## Task 6: Course Detail Pages

**Files:**
- Create: `src/app/[lang]/programs/ai-ml/page.tsx`
- Create: `src/app/[lang]/programs/cs/page.tsx`
- Create: `src/app/[lang]/programs/information-systems/page.tsx`
- Create: `src/components/ProgramPage.tsx` (shared layout)

- [ ] **Step 1: Create shared `ProgramPage` component**

  ```tsx
  // src/components/ProgramPage.tsx
  import Link from 'next/link'
  import { Button } from '@/components/ui/button'

  interface ProgramPageProps {
    lang: string
    hero: { title: string; tagline: string; cta: string }
    overview: { title: string; goal: string; audience: string }
    courses: { title: string; core: string[]; electives: string[] }
    outcomes: { title: string; items: string[] }
    requirements: { title: string; items: string[] }
  }

  export default function ProgramPage({ lang, hero, overview, courses, outcomes, requirements }: ProgramPageProps) {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <section className="container mx-auto px-4 py-24 max-w-4xl">
          <h1 className="text-5xl font-bold text-slate-100 mb-4">{hero.title}</h1>
          <p className="text-xl text-slate-400 mb-8">{hero.tagline}</p>
          <Link href={`/${lang}#contact`}>
            <Button size="lg">{hero.cta}</Button>
          </Link>
        </section>

        {/* Overview */}
        <section className="bg-slate-900 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">{overview.title}</h2>
            <p className="text-slate-300 mb-3">{overview.goal}</p>
            <p className="text-slate-400">{overview.audience}</p>
          </div>
        </section>

        {/* Courses */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-8">{courses.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">{lang === 'zh' ? '核心课程' : 'Core Courses'}</h3>
                <ul className="space-y-2">
                  {courses.core.map((c) => <li key={c} className="text-slate-400 flex items-start gap-2"><span className="text-blue-400 mt-1">▸</span>{c}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">{lang === 'zh' ? '选修课程' : 'Electives'}</h3>
                <ul className="space-y-2">
                  {courses.electives.map((c) => <li key={c} className="text-slate-400 flex items-start gap-2"><span className="text-slate-500 mt-1">▸</span>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="bg-slate-900 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">{outcomes.title}</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {outcomes.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Requirements + CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">{requirements.title}</h2>
            <ul className="space-y-2 mb-12">
              {requirements.items.map((item) => (
                <li key={item} className="text-slate-400 flex items-start gap-2"><span className="text-blue-400 mt-1">•</span>{item}</li>
              ))}
            </ul>
            <Link href={`/${lang}#contact`}>
              <Button size="lg">{hero.cta}</Button>
            </Link>
          </div>
        </section>
      </div>
    )
  }
  ```

- [ ] **Step 2: Create `src/app/[lang]/programs/ai-ml/page.tsx`**

  ```tsx
  import { getTranslations } from 'next-intl/server'
  import ProgramPage from '@/components/ProgramPage'

  export default async function AiMlPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const t = await getTranslations('Programs.ai-ml')
    return (
      <ProgramPage
        lang={lang}
        hero={{ title: t('hero.title'), tagline: t('hero.tagline'), cta: t('hero.cta') }}
        overview={{ title: t('overview.title'), goal: t('overview.goal'), audience: t('overview.audience') }}
        courses={{ title: t('courses.title'), core: ['Introduction to Machine Learning','Deep Learning & Neural Networks','Natural Language Processing','Computer Vision','MLOps & Model Deployment'], electives: ['Reinforcement Learning','AI Ethics & Policy','Applied Statistics'] }}
        outcomes={{ title: t('outcomes.title'), items: ['Build and deploy production ML models','Work with real-world datasets at scale','Apply AI to solve domain-specific problems','Contribute to open-source AI projects'] }}
        requirements={{ title: t('requirements.title'), items: ["Bachelor's degree or equivalent","English proficiency (TOEFL 80+ or IELTS 6.5+)","Basic programming experience (Python preferred)"] }}
      />
    )
  }
  ```

  > Note: For CS and IS pages, duplicate this pattern substituting `Programs.cs` and `Programs.information-systems` with the matching arrays from Task 5's i18n content.

- [ ] **Step 3: Create `src/app/[lang]/programs/cs/page.tsx`** — same pattern as ai-ml, using `getTranslations('Programs.cs')` and the CS course arrays.

- [ ] **Step 4: Create `src/app/[lang]/programs/information-systems/page.tsx`** — same pattern, using `getTranslations('Programs.information-systems')` and IS arrays.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/ProgramPage.tsx src/app/[lang]/programs/
  git commit -m "feat: add course detail pages for AI/ML, CS, and IS"
  ```

---

## Task 7: Contact Form Component

**Files:**
- Create: `src/components/ContactForm.tsx`

- [ ] **Step 1: Create `src/components/ContactForm.tsx`**

  ```tsx
  'use client'
  import { useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { Button } from '@/components/ui/button'

  type FormState = 'idle' | 'loading' | 'success' | 'error'

  export default function ContactForm({ lang }: { lang: string }) {
    const t = useTranslations('Contact')
    const [state, setState] = useState<FormState>('idle')
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setState('loading')
      const data = Object.fromEntries(new FormData(e.currentTarget))
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, lang }),
        })
        if (!res.ok) throw new Error(await res.text())
        setState('success')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setState('error')
      }
    }

    if (state === 'success') {
      return <div className="p-6 rounded-lg bg-green-900/30 border border-green-700 text-green-300">{t('successMessage')}</div>
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">{t('name')} *</label>
            <input name="name" required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">{t('email')} *</label>
            <input name="email" type="email" required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">{t('phone')}</label>
            <input name="phone" type="tel" className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">{t('program')} *</label>
            <select name="program" required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500">
              <option value="">{t('programPlaceholder')}</option>
              <option value="ai-ml">{t('programAiMl')}</option>
              <option value="cs">{t('programCs')}</option>
              <option value="information-systems">{t('programIs')}</option>
              <option value="partnership">{t('programPartnership')}</option>
              <option value="faculty">{t('programFaculty')}</option>
              <option value="other">{t('programOther')}</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">{t('message')} *</label>
          <textarea name="message" required rows={4} className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
        </div>
        {state === 'error' && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={state === 'loading'}>
          {state === 'loading' ? t('sending') : t('submit')}
        </Button>
      </form>
    )
  }
  ```

- [ ] **Step 2: Add Contact form i18n keys to `messages/en.json`** under existing `"Landing"` section or a new `"Contact"` key:

  ```json
  "Contact": {
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone (optional)",
    "program": "Area of Interest",
    "programPlaceholder": "Select one...",
    "programAiMl": "AI & Machine Learning",
    "programCs": "Computer Science",
    "programIs": "Information Systems",
    "programPartnership": "Institutional Partnership",
    "programFaculty": "Faculty / Advisor Role",
    "programOther": "Other",
    "message": "Message",
    "submit": "Send Message",
    "sending": "Sending...",
    "successMessage": "Thank you! We will be in touch within 2 business days."
  }
  ```

- [ ] **Step 3: Add same keys to `messages/zh.json`** with Chinese translations.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/ContactForm.tsx messages/
  git commit -m "feat: add bilingual ContactForm component"
  ```

---

## Task 8: Contact API Route

**Files:**
- Create: `src/app/api/contact/route.ts`

- [ ] **Step 1: Create `src/app/api/contact/route.ts`**

  ```ts
  import { z } from 'zod'
  import { Resend } from 'resend'

  export const runtime = 'edge'

  const schema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(30).optional(),
    program: z.enum(['ai-ml', 'cs', 'information-systems', 'partnership', 'faculty', 'other']),
    message: z.string().min(1).max(2000),
    lang: z.enum(['en', 'zh']),
  })

  export async function POST(req: Request) {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 })
    }

    const { name, email, phone, program, message, lang } = parsed.data
    const adminEmail = process.env.ADMIN_EMAIL!
    const resend = new Resend(process.env.RESEND_API_KEY!)

    // Send email notification
    await resend.emails.send({
      from: 'TIAI Contact <noreply@texasinstituteofai.org>',
      to: adminEmail,
      subject: `New contact form submission: ${program}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? 'N/A'}\nProgram: ${program}\nLang: ${lang}\n\n${message}`,
    })

    // Write to Airtable via REST API
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email,
            Phone: phone ?? '',
            Program: program,
            Message: message,
            Lang: lang,
            'Submitted At': new Date().toISOString(),
          },
        }),
      }
    )

    if (!airtableRes.ok) {
      const err = await airtableRes.text()
      console.error('Airtable error:', err)
      // Still return success to user — email was sent
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/app/api/contact/route.ts
  git commit -m "feat: add Edge Runtime contact API route with Resend + Airtable"
  ```

---

## Task 9: Header Navigation & Sitemap

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

- [ ] **Step 1: Add navigation i18n keys**

  In `messages/en.json`, add to `"Navigation"`:
  ```json
  "blog": "News",
  "programsNav": "Programs"
  ```
  In `messages/zh.json`:
  ```json
  "blog": "新闻",
  "programsNav": "课程"
  ```

- [ ] **Step 2: Update `src/components/Header.tsx` nav links**

  In the `<nav>` block, add before the existing `#programs` anchor link:
  ```tsx
  <Link href={`/${locale}/programs/ai-ml`} className="transition-colors hover:text-primary">
    {t("programsNav")}
  </Link>
  <Link href={`/${locale}/blog`} className="transition-colors hover:text-primary">
    {t("blog")}
  </Link>
  ```

- [ ] **Step 3: Update `src/app/sitemap.ts`**

  Add entries for all course pages and blog list:
  ```ts
  // Course pages
  ...['ai-ml', 'cs', 'information-systems'].flatMap((slug) =>
    ['en', 'zh'].map((lang) => ({
      url: `${siteUrl}/${lang}/programs/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  ),
  // Blog list
  ...['en', 'zh'].map((lang) => ({
    url: `${siteUrl}/${lang}/blog`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })),
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/Header.tsx src/app/sitemap.ts messages/
  git commit -m "feat: add blog and programs nav links, update sitemap"
  ```

---

## Task 10: Wire ContactForm into Homepage

**Files:**
- Modify: `src/app/[lang]/page.tsx`

- [ ] **Step 1: Import and use ContactForm in the contact section**

  In `src/app/[lang]/page.tsx`, find the existing contact section (look for `id="contact"`) and replace the static content with:
  ```tsx
  import ContactForm from '@/components/ContactForm'
  // ...
  <section id="contact" className="...existing classes...">
    <h2>...</h2>
    <ContactForm lang={lang} />
  </section>
  ```

  Read the file first to find the exact contact section markup before editing.

- [ ] **Step 2: Commit**

  ```bash
  git add src/app/[lang]/page.tsx
  git commit -m "feat: integrate ContactForm into homepage contact section"
  ```

---

## Task 11: Final Verification

- [ ] **Step 1: Build the project**

  ```bash
  cd D:/TIAI-Nexus && npm run build
  ```

  Expected: build completes with no TypeScript errors. All static pages generated including `/en/programs/ai-ml`, `/en/blog`, etc.

- [ ] **Step 2: Run dev server and manually verify**

  ```bash
  npm run dev
  ```

  Check:
  - `http://localhost:3000/en/blog` — blog list renders
  - `http://localhost:3000/en/blog/welcome` — post detail renders
  - `http://localhost:3000/zh/blog/welcome` — Chinese version renders
  - `http://localhost:3000/en/programs/ai-ml` — course page renders
  - Contact form visible on homepage, submits to `/api/contact`
  - Header shows new nav links

- [ ] **Step 3: Set environment variables in Cloudflare Pages dashboard**

  Add all vars from `.env.example` to the Cloudflare Pages project settings under Settings → Environment Variables.

- [ ] **Step 4: Final commit and deploy**

  ```bash
  git add -A
  git commit -m "chore: final verification and cleanup"
  ```

