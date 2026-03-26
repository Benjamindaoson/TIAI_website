import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
      const { data } = matter(raw)
      return {
        slug: parsed.slug,
        lang: parsed.lang,
        title: data.title ?? '',
        date: data.date ?? '',
        author: data.author ?? '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        excerpt: data.excerpt ?? '',
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
  const { data, content } = matter(raw)
  return {
    slug,
    lang,
    content,
    title: data.title ?? '',
    date: data.date ?? '',
    author: data.author ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: data.excerpt ?? '',
  }
}

export function getAllSlugs(): { slug: string; lang: string }[] {
  return readPostsDir()
    .map(parseFilename)
    .filter((p): p is { slug: string; lang: string } => p !== null)
}
