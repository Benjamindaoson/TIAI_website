import { getTranslations } from 'next-intl/server'
import ProgramPage from '@/components/ProgramPage'

export default async function InformationSystemsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations('Programs.information-systems')
  return (
    <ProgramPage
      lang={lang}
      hero={{ title: t('hero.title'), tagline: t('hero.tagline'), cta: t('hero.cta') }}
      overview={{ title: t('overview.title'), goal: t('overview.goal'), audience: t('overview.audience') }}
      courses={{
        title: t('courses.title'),
        core: [
          'Information Systems Analysis',
          'Database Management',
          'Business Intelligence & Analytics',
          'IT Project Management',
          'Enterprise Systems (ERP/CRM)',
        ],
        electives: [
          'Data Visualization',
          'Digital Transformation',
          'Information Security Management',
        ],
      }}
      outcomes={{
        title: t('outcomes.title'),
        items: [
          'Analyze and design information systems for organizations',
          'Apply data analytics to business decisions',
          'Manage IT projects using industry frameworks',
          'Communicate technical concepts to non-technical stakeholders',
        ],
      }}
      requirements={{
        title: t('requirements.title'),
        items: [
          "Bachelor's degree or equivalent",
          'English proficiency (TOEFL 75+ or IELTS 6.0+)',
          'Basic familiarity with spreadsheets or databases',
        ],
      }}
    />
  )
}
