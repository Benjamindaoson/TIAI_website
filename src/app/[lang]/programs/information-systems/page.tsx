import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import ProgramPage from '@/components/ProgramPage'
import { getSiteUrl } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Programs.information-systems' })
  const siteUrl = getSiteUrl()
  return {
    title: `${t('hero.title')} | TIAI`,
    description: t('hero.tagline'),
    alternates: {
      canonical: `${siteUrl}/${lang}/programs/information-systems`,
      languages: {
        en: `${siteUrl}/en/programs/information-systems`,
        zh: `${siteUrl}/zh/programs/information-systems`,
      },
    },
  }
}

export default async function IsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations('Programs.information-systems')
  return (
    <ProgramPage
      lang={lang}
      hero={{ title: t('hero.title'), tagline: t('hero.tagline'), cta: t('hero.cta') }}
      overview={{ title: t('overview.title'), goal: t('overview.goal'), audience: t('overview.audience') }}
      courses={{
        title: t('courses.title'),
        core: t.raw('courses.coreList') as string[],
        electives: t.raw('courses.electiveList') as string[],
      }}
      outcomes={{
        title: t('outcomes.title'),
        items: t.raw('outcomes.items') as string[],
      }}
      requirements={{
        title: t('requirements.title'),
        items: t.raw('requirements.items') as string[],
      }}
    />
  )
}
