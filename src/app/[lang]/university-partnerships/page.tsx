import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { anchorHref } from '@/lib/routes'
import { getSiteUrl } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'UniversityPartnerships' })
  const siteUrl = getSiteUrl()
  return {
    title: `${t('heroTitle')} | TIAI`,
    description: t('heroBody'),
    alternates: {
      canonical: `${siteUrl}/${lang}/university-partnerships`,
      languages: { en: `${siteUrl}/en/university-partnerships`, zh: `${siteUrl}/zh/university-partnerships` },
    },
  }
}

export default async function UniversityPartnershipsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'UniversityPartnerships' })
  const models = t.raw('models') as Array<{ title: string; body: string }>
  const responsibilities = t.raw('responsibilities') as Array<{ title: string; items: string[] }>
  const process = t.raw('process') as string[]

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
          <h2 className="text-2xl font-bold">{t('modelsTitle')}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {models.map((model) => (
              <article key={model.title} className="border border-slate-700 bg-slate-950 p-6">
                <h3 className="text-lg font-semibold text-white">{model.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{model.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold">{t('responsibilitiesTitle')}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {responsibilities.map((group) => (
              <article key={group.title} className="border border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-3 text-slate-300">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold">{t('processTitle')}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {process.map((step, index) => (
              <li key={step} className="border border-slate-700 bg-slate-950 p-6 text-slate-300">
                <span className="text-sm text-amber-400">{index + 1}</span>
                <p className="mt-3 leading-7">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 border border-amber-500/30 p-4 text-sm leading-6 text-slate-300">{t('disclaimer')}</p>
        </div>
      </section>
    </div>
  )
}
