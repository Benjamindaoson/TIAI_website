interface LaunchPageProps {
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
}

export default function LaunchPage({ title, description, sections }: LaunchPageProps) {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-100 md:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>
      </header>
      <div className="mt-12 space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-slate-100">{section.title}</h2>
            <p className="mt-3 leading-7 text-slate-300">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
