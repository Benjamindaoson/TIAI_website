import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ProgramPageProps {
  lang: string
  hero: { title: string; tagline: string; cta: string }
  overview: { title: string; goal: string; audience: string }
  courses: { title: string; core: string[]; electives: string[] }
  outcomes: { title: string; items: string[] }
  requirements: { title: string; items: string[] }
}

export default function ProgramPage({ lang, hero, overview, courses, outcomes, requirements }: ProgramPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-5xl font-bold text-slate-100 mb-4">{hero.title}</h1>
        <p className="text-xl text-slate-400 mb-8">{hero.tagline}</p>
        <Link href={`/${lang}#contact`}>
          <Button size="lg">{hero.cta}</Button>
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

      {/* Courses */}
      <section className="py-16">
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
      <section className="bg-slate-900 py-16">
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
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">{requirements.title}</h2>
          <ul className="space-y-2 mb-12">
            {requirements.items.map((item) => (
              <li key={item} className="text-slate-400 flex items-start gap-2">
                <span className="text-blue-400 mt-1">&bull;</span>{item}
              </li>
            ))}
          </ul>
          <Link href={`/${lang}#contact`}>
            <Button size="lg">{hero.cta}</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
