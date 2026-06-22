import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site'
import { anchorHref } from '@/lib/routes'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Faculty' })
  const siteUrl = getSiteUrl()
  return {
    title: `${t('heroTitle')} | TIAI`,
    description: t('heroBody'),
    alternates: {
      canonical: `${siteUrl}/${lang}/faculty`,
      languages: { en: `${siteUrl}/en/faculty`, zh: `${siteUrl}/zh/faculty` },
    },
  }
}
export default async function FacultyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Faculty' })
  const roles = [
    { title: t('role1Title'), body: t('role1Body') },
    { title: t('role2Title'), body: t('role2Body') },
    { title: t('role3Title'), body: t('role3Body') },
  ]
  const benefits = [t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4')]
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-24 max-w-4xl">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-wider mb-4">{t('heroTag')}</p>
        <h1 className="text-5xl font-bold text-slate-100 mb-6">{t('heroTitle')}</h1>
        <p className="text-xl text-slate-400">{t('heroBody')}</p>
      </section>
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-8">{t('whyTitle')}</h2>
          <ul className="grid md:grid-cols-2 gap-4 mb-8">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-slate-300">
                <span className="text-green-400 mt-1">&#10003;</span>{b}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {roles.map((role) => (
              <div key={role.title} className="border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">{role.title}</h3>
                <p className="text-slate-400 text-sm">{role.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-3">{t('ctaTitle')}</h2>
            <p className="text-slate-400 mb-6">{t('ctaBody')}</p>
            <Link href={anchorHref(lang, 'contact')}>
              <Button size="lg">{lang === 'zh' ? '\u7acb\u5373\u7533\u8bf7' : 'Apply Now'}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
