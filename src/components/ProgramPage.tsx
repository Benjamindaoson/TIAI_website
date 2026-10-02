import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { anchorHref } from '@/lib/routes'

interface ProgramPageProps {
  lang: string
  hero: { title: string; tagline: string; cta: string }
  overview: { title: string; goal: string; audience: string }
  courses: { title: string; core: string[]; electives: string[] }
  outcomes: { title: string; items: string[] }
  requirements: { title: string; items: string[] }
  details: {
    formatTitle: string
    formatItems: string[]
    assessmentTitle: string
    assessmentItems: string[]
    applicationTitle: string
    applicationItems: string[]
    disclaimer: string
  }
}

export default function ProgramPage({ lang, hero, overview, courses, outcomes, requirements, details }: ProgramPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-100 mb-4 md:text-5xl">{hero.title}</h1>
        <p className="text-xl text-slate-400 mb-8">{hero.tagline}</p>
        <p className="mb-8 border border-amber-500/30 bg-slate-950 p-4 text-sm leading-6 text-slate-300">{details.disclaimer}</p>
        <Link href={anchorHref(lang, 'contact')}>
          <Button size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">{hero.cta}</Button>
        </Link>
      </section>

      {/* Overview */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">{overview.title}</h2>
          <p className="text-slate-300 mb-3">{overview.goal}</p>
          <p className="text-slate-400">{overview.audience}</p>
        </div>
      </section>

      {/* Format and assessment */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">{details.formatTitle}</h2>
            <ul className="space-y-3">
              {details.formatItems.map((item) => (
                <li key={item} className="text-slate-400 flex items-start gap-2">
                  <span className="text-amber-400 mt-1">&bull;</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">{details.assessmentTitle}</h2>
            <ul className="space-y-3">
              {details.assessmentItems.map((item) => (
                <li key={item} className="text-slate-400 flex items-start gap-2">
                  <span className="text-amber-400 mt-1">&bull;</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-8">{courses.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4">{lang === 'zh' ? '\u6838\u5fc3\u8bfe\u7a0b' : 'Core Courses'}</h3>
              <ul className="space-y-2">
                {courses.core.map((c) => (
                  <li key={c} className="text-slate-400 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">&#9658;</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4">{lang === 'zh' ? '\u9009\u4fee\u8bfe\u7a0b' : 'Electives'}</h3>
              <ul className="space-y-2">
                {courses.electives.map((c) => (
                  <li key={c} className="text-slate-400 flex items-start gap-2">
                    <span className="text-slate-500 mt-1">&#9658;</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">{outcomes.title}</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {outcomes.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-300">
                <span className="text-green-400 mt-1">&#10003;</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Requirements + CTA */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">{requirements.title}</h2>
          <ul className="space-y-2 mb-12">
            {requirements.items.map((item) => (
              <li key={item} className="text-slate-400 flex items-start gap-2">
                <span className="text-blue-400 mt-1">&bull;</span>{item}
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-bold text-slate-100 mb-6">{details.applicationTitle}</h2>
          <ol className="space-y-2 mb-12">
            {details.applicationItems.map((item, index) => (
              <li key={item} className="text-slate-400 flex items-start gap-3">
                <span className="text-amber-400">{index + 1}.</span>{item}
              </li>
            ))}
          </ol>
          <Link href={anchorHref(lang, 'contact')}>
            <Button size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">{hero.cta}</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
