import { getTranslations } from 'next-intl/server'
import ProgramPage from '@/components/ProgramPage'

export default async function AiMlPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations('Programs.ai-ml')
  return (
    <ProgramPage
      lang={lang}
      hero={{ title: t('hero.title'), tagline: t('hero.tagline'), cta: t('hero.cta') }}
      overview={{ title: t('overview.title'), goal: t('overview.goal'), audience: t('overview.audience') }}
      courses={{
        title: t('courses.title'),
        core: [
          'Introduction to Machine Learning',
          'Deep Learning & Neural Networks',
          'Natural Language Processing',
          'Computer Vision',
          'MLOps & Model Deployment',
        ],
        electives: [
          'Reinforcement Learning',
          'AI Ethics & Policy',
          'Applied Statistics',
        ],
      }}
      outcomes={{
        title: t('outcomes.title'),
        items: [
          'Build and deploy production ML models',
          'Work with real-world datasets at scale',
          'Apply AI to solve domain-specific problems',
          'Contribute to open-source AI projects',
        ],
      }}
      requirements={{
        title: t('requirements.title'),
        items: [
          "Bachelor's degree or equivalent",
          'English proficiency (TOEFL 80+ or IELTS 6.5+)',
          'Basic programming experience (Python preferred)',
        ],
      }}
    />
  )
}
