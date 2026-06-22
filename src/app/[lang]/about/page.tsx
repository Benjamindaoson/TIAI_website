import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'About' })
  const siteUrl = getSiteUrl()
  return {
    title: `${t('heroTitle')} | TIAI`,
    description: t('heroBody'),
    alternates: {
      canonical: `${siteUrl}/${lang}/about`,
      languages: { en: `${siteUrl}/en/about`, zh: `${siteUrl}/zh/about` },
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  void lang
  const t = await getTranslations('About')
  const values = [
    { title: t('value1Title'), body: t('value1Body') },
    { title: t('value2Title'), body: t('value2Body') },
    { title: t('value3Title'), body: t('value3Body') },
  ]
  const regs = [t('reg1'), t('reg2'), t('reg3'), t('reg4'), t('reg5'), t('reg6')]
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-24 max-w-4xl">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-wider mb-4">{t('heroTag')}</p>
        <h1 className="text-5xl font-bold text-slate-100 mb-6">{t('heroTitle')}</h1>
        <p className="text-xl text-slate-400">{t('heroBody')}</p>
      </section>
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-3">{t('missionTitle')}</h2>
            <p className="text-slate-400">{t('missionBody')}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-3">{t('modelTitle')}</h2>
            <p className="text-slate-400">{t('modelBody')}</p>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-8">{t('valuesTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {values.map((v) => (
              <div key={v.title} className="border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm">{v.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 rounded-lg p-8">
            <h2 className="text-xl font-bold text-slate-100 mb-4">{t('legalTitle')}</h2>
            <ul className="space-y-1">
              {regs.map((r) => (
                <li key={r} className="text-slate-400 text-sm">{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
