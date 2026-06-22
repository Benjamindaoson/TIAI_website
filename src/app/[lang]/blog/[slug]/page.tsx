import type { Metadata } from 'next'
import { getPost, getAllSlugs } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site'
import { localizedHref } from '@/lib/routes'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  let post = getPost(slug, lang)
  if (!post && lang === 'zh') post = getPost(slug, 'en')
  if (!post) return {}
  const siteUrl = getSiteUrl()
  return {
    title: `${post.title} | TIAI`,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/${lang}/blog/${slug}`,
      languages: {
        en: `${siteUrl}/en/blog/${slug}`,
        zh: `${siteUrl}/zh/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/${lang}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

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
      <Link href={localizedHref(lang, '/blog')} className="text-sm text-slate-400 hover:text-slate-200 mb-8 inline-block">
        ← {t('backToNews')}
      </Link>
      <time dateTime={post!.date} className="text-sm text-slate-500">{post!.date}</time>
      <h1 className="text-4xl font-bold text-slate-100 mt-2 mb-4">{post!.title}</h1>
      <p className="text-slate-400 text-sm mb-8">By {post!.author}</p>
      <div className="prose prose-invert prose-slate max-w-none">
        <MDXRemote source={post!.content} />
      </div>
    </article>
  )
}
