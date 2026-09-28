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
  const t = await getTranslations({ locale: lang, namespace: 'Programs.cs' })
  const siteUrl = getSiteUrl()
  return {
    title: `${t('hero.title')} | TIAI`,
    description: t('hero.tagline'),
    alternates: {
      canonical: `${siteUrl}/${lang}/programs/cs`,
      languages: {
        en: `${siteUrl}/en/programs/cs`,
        zh: `${siteUrl}/zh/programs/cs`,
      },
    },
  }
}

export default async function CsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations('Programs.cs')
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
      details={{
        formatTitle: t('details.formatTitle'),
        formatItems: t.raw('details.formatItems') as string[],
        assessmentTitle: t('details.assessmentTitle'),
        assessmentItems: t.raw('details.assessmentItems') as string[],
        applicationTitle: t('details.applicationTitle'),
        applicationItems: t.raw('details.applicationItems') as string[],
        disclaimer: t('details.disclaimer'),
      }}
    />
  )
}
