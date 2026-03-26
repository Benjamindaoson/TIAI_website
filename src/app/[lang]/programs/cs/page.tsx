import { getTranslations } from 'next-intl/server'
import ProgramPage from '@/components/ProgramPage'

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
        core: [
          'Data Structures & Algorithms',
          'Operating Systems',
          'Computer Networks',
          'Software Engineering',
          'Database Systems',
        ],
        electives: [
          'Cloud Computing',
          'Cybersecurity Fundamentals',
          'Mobile App Development',
        ],
      }}
      outcomes={{
        title: t('outcomes.title'),
        items: [
          'Design and implement scalable software systems',
          'Apply core CS theory to engineering problems',
          'Collaborate in agile development teams',
          'Prepare for U.S. transfer or employment',
        ],
      }}
      requirements={{
        title: t('requirements.title'),
        items: [
          'High school diploma or equivalent',
          'English proficiency (TOEFL 70+ or IELTS 6.0+)',
          'Mathematics background (calculus recommended)',
        ],
      }}
    />
  )
}
