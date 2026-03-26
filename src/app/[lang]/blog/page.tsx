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
