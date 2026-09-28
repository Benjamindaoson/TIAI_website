import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { anchorHref, localizedHref } from '@/lib/routes'
import { getSiteUrl } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'ForStudents' })
  const siteUrl = getSiteUrl()
  return {
    title: `${t('heroTitle')} | TIAI`,
    description: t('heroBody'),
    alternates: {
      canonical: `${siteUrl}/${lang}/for-students`,
      languages: { en: `${siteUrl}/en/for-students`, zh: `${siteUrl}/zh/for-students` },
    },
  }
}

export default async function ForStudentsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'ForStudents' })
  const fit = t.raw('fitItems') as string[]
  const paths = t.raw('pathItems') as Array<{ title: string; body: string; href: string }>
  const application = t.raw('applicationItems') as string[]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="container mx-auto max-w-5xl px-4 py-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-400">{t('heroTag')}</p>
        <h1 className="max-w-4xl text-4xl font-bold md:text-5xl">{t('heroTitle')}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{t('heroBody')}</p>
        <Link href={anchorHref(lang, 'contact')} className="mt-8 inline-block">
          <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">{t('cta')}</Button>
        </Link>
      </section>

      <section className="border-y border-slate-800 bg-slate-900 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold">{t('fitTitle')}</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {fit.map((item) => (
              <li key={item} className="border border-slate-700 bg-slate-950 p-6 text-slate-300">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold">{t('pathsTitle')}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {paths.map((path) => (
              <Link key={path.href} href={localizedHref(lang, path.href)} className="border border-slate-800 p-6 transition-colors hover:border-amber-400/60">
                <h3 className="text-lg font-semibold text-white">{path.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{path.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold">{t('applicationTitle')}</h2>
          <ol className="mt-8 space-y-4">
            {application.map((item, index) => (
              <li key={item} className="flex gap-4 text-slate-300">
                <span className="text-amber-400">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 border border-amber-500/30 p-4 text-sm leading-6 text-slate-300">{t('disclaimer')}</p>
        </div>
      </section>
    </div>
  )
}
