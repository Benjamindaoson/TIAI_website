import fs from 'fs'
import path from 'path'
import { parseFrontmatter, type FrontmatterData } from './frontmatter'

const postsDir = path.join(process.cwd(), 'content/posts')

function readPostsDir(): string[] {
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
}

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
  const files = readPostsDir()
  return files
    .map((filename) => {
      const parsed = parseFilename(filename)
      if (!parsed || parsed.lang !== lang) return null
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
      const { data } = parseFrontmatter(raw)
      return {
        slug: parsed.slug,
        lang: parsed.lang,
        title: getString(data, 'title'),
        date: getString(data, 'date'),
        author: getString(data, 'author'),
        tags: getStringArray(data, 'tags'),
        excerpt: getString(data, 'excerpt'),
      } satisfies PostMeta
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug: string, lang: string): Post | null {
  const filename = readPostsDir().find((f) => {
    const parsed = parseFilename(f)
    return parsed?.slug === slug && parsed?.lang === lang
  })
  if (!filename) return null
  const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    lang,
    content,
    title: getString(data, 'title'),
    date: getString(data, 'date'),
    author: getString(data, 'author'),
    tags: getStringArray(data, 'tags'),
    excerpt: getString(data, 'excerpt'),
  }
}

export function getAllSlugs(): { slug: string; lang: string }[] {
  return readPostsDir()
    .map(parseFilename)
    .filter((p): p is { slug: string; lang: string } => p !== null)
}

function getString(data: FrontmatterData, key: string) {
  const value = data[key]
  return typeof value === 'string' ? value : ''
}

function getStringArray(data: FrontmatterData, key: string) {
  const value = data[key]
  return Array.isArray(value) ? value : []
}
