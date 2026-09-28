import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { localizedHref } from "@/lib/routes";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");
  const locale = await t("locale");

  return (
    <section className="container mx-auto flex min-h-[70vh] max-w-4xl flex-col items-start justify-center px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">{t("eyebrow")}</p>
      <h1 className="mt-4 text-4xl font-light text-white md:text-5xl">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{t("body")}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild className="bg-amber-400 text-slate-950 hover:bg-amber-300">
          <Link href={localizedHref(locale)}>{t("primary")}</Link>
        </Button>
        <Button asChild variant="outline" className="border-amber-400 text-amber-300 hover:bg-amber-400/10">
          <Link href={localizedHref(locale, "/about")}>{t("secondary")}</Link>
        </Button>
      </div>
    </section>
  );
}
