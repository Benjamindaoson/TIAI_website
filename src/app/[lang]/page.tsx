import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = useTranslations("Landing");

  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-amber-500/20 px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-amber-400">{t("heroTag")}</p>
          <h1 className="max-w-4xl text-4xl font-light leading-tight text-white md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{t("heroBody")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="bg-amber-400 text-slate-950 hover:bg-amber-300">
              <Link href="#partnership">{t("ctaPrimary")}</Link>
            </Button>
            <Button asChild variant="outline" className="border-amber-400 text-amber-300 hover:bg-amber-400/10">
              <Link href="#faculty">{t("ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-amber-500/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{t("aboutTag")}</p>
          <h2 className="mt-3 text-3xl font-light text-white md:text-4xl">{t("aboutTitle")}</h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{t("aboutBody")}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-sm uppercase tracking-[0.14em] text-amber-300">{t("aboutPoint1Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("aboutPoint1Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-sm uppercase tracking-[0.14em] text-amber-300">{t("aboutPoint2Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("aboutPoint2Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-sm uppercase tracking-[0.14em] text-amber-300">{t("aboutPoint3Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("aboutPoint3Body")}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="programs" className="border-b border-amber-500/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{t("programsTag")}</p>
          <h2 className="mt-3 text-3xl font-light text-white md:text-4xl">{t("programsTitle")}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-xl text-white">{t("program1Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("program1Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-xl text-white">{t("program2Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("program2Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-xl text-white">{t("program3Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("program3Body")}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="partnership" className="border-b border-amber-500/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{t("partnershipTag")}</p>
            <h2 className="mt-3 text-3xl font-light text-white md:text-4xl">{t("partnershipTitle")}</h2>
            <p className="mt-6 max-w-5xl leading-8 text-slate-300">{t("partnershipBody")}</p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("partnershipHowTitle")}</h3>
              <ol className="mt-4 space-y-4 text-slate-300">
                <li>1. {t("partnershipStep1")}</li>
                <li>2. {t("partnershipStep2")}</li>
                <li>3. {t("partnershipStep3")}</li>
              </ol>
            </div>
            <div className="space-y-4">
              <div className="border border-amber-500/20 bg-slate-900 p-6">
                <h3 className="text-lg text-white">{t("partnershipCardTitle")}</h3>
                <ul className="mt-4 space-y-3 text-slate-300">
                  <li>{t("partnershipPoint1")}</li>
                  <li>{t("partnershipPoint2")}</li>
                  <li>{t("partnershipPoint3")}</li>
                  <li>{t("partnershipPoint4")}</li>
                </ul>
              </div>
              <div className="border border-amber-500/20 bg-slate-900 p-6">
                <h3 className="text-lg text-white">{t("partnershipGovernanceTitle")}</h3>
                <p className="mt-3 leading-7 text-slate-300">{t("partnershipGovernanceBody")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faculty" className="border-b border-amber-500/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{t("facultyTag")}</p>
          <h2 className="mt-3 text-3xl font-light text-white md:text-4xl">{t("facultyTitle")}</h2>
          <p className="mt-6 max-w-4xl leading-8 text-slate-300">{t("facultyBody")}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("facultyBenefit1Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("facultyBenefit1Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("facultyBenefit2Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("facultyBenefit2Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("facultyBenefit3Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("facultyBenefit3Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("facultyBenefit4Title")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("facultyBenefit4Body")}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="insights" className="border-b border-amber-500/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{t("insightsTag")}</p>
          <h2 className="mt-3 text-3xl font-light text-white md:text-4xl">{t("insightsTitle")}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("insight1Title")}</h3>
              <p className="mt-3 text-slate-300">{t("insight1Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("insight2Title")}</h3>
              <p className="mt-3 text-slate-300">{t("insight2Body")}</p>
            </article>
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-lg text-white">{t("insight3Title")}</h3>
              <p className="mt-3 text-slate-300">{t("insight3Body")}</p>
            </article>
          </div>
          <div className="mt-8 border border-amber-500/20 bg-slate-900 p-6">
            <h3 className="text-lg text-white">{t("insightRegistryTitle")}</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <p>{t("registryLine1")}</p>
              <p>{t("registryLine2")}</p>
              <p>{t("registryLine3")}</p>
              <p>{t("registryLine4")}</p>
              <p>{t("registryLine5")}</p>
              <p>{t("registryLine6")}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400">{t("contactTag")}</p>
          <h2 className="mt-3 text-3xl font-light text-white md:text-4xl">{t("contactTitle")}</h2>
          <p className="mt-6 max-w-3xl leading-8 text-slate-300">{t("contactBody")}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="border border-amber-500/20 bg-slate-900 p-6">
              <h3 className="text-sm uppercase tracking-[0.14em] text-amber-300">{t("contactAddressTitle")}</h3>
              <p className="mt-3 leading-7 text-slate-300">{t("contactAddressBody")}</p>
            </article>
            <div className="space-y-3 text-sm text-amber-300">
              <a href="mailto:partnerships@tiai.edu" className="block border border-amber-500/30 px-4 py-3 hover:bg-amber-500/10">
                {t("contactMail1")}
              </a>
              <a href="mailto:faculty@tiai.edu" className="block border border-amber-500/30 px-4 py-3 hover:bg-amber-500/10">
                {t("contactMail2")}
              </a>
              <a href="mailto:admissions@tiai.edu" className="block border border-amber-500/30 px-4 py-3 hover:bg-amber-500/10">
                {t("contactMail3")}
              </a>
            </div>
          </div>
          <div className="mt-10">
            <ContactForm lang={lang} />
          </div>
        </div>
      </section>
    </div>
  );
}
