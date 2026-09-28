"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { localizedHref } from "@/lib/routes";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <footer className="bg-slate-900 text-slate-50 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-lg font-semibold mb-4">Texas Institute of Artificial Intelligence</h3>
        <p className="mb-2 text-slate-400">{t("address")}</p>
        <p className="text-sm text-slate-500">{t("nonprofit")}</p>
        <div className="mt-6 flex max-w-4xl flex-wrap justify-center gap-5 text-xs text-slate-500">
          <Link href={localizedHref(locale, "/about")} className="hover:text-slate-300">{t("about")}</Link>
          <Link href={localizedHref(locale, "/university-partnerships")} className="hover:text-slate-300">{t("universities")}</Link>
          <Link href={localizedHref(locale, "/for-students")} className="hover:text-slate-300">{t("students")}</Link>
          <Link href={localizedHref(locale, "/admissions")} className="hover:text-slate-300">{t("admissions")}</Link>
          <Link href={localizedHref(locale, "/tuition")} className="hover:text-slate-300">{t("tuition")}</Link>
          <Link href={localizedHref(locale, "/faq")} className="hover:text-slate-300">{t("faq")}</Link>
        </div>
        <div className="mt-3 flex max-w-4xl flex-wrap justify-center gap-5 text-xs text-slate-500">
          <Link href={localizedHref(locale, "/institutional-disclosures")} className="hover:text-slate-300">{t("disclosures")}</Link>
          <Link href={localizedHref(locale, "/privacy")} className="hover:text-slate-300">{t("privacy")}</Link>
          <Link href={localizedHref(locale, "/terms")} className="hover:text-slate-300">{t("terms")}</Link>
          <Link href={localizedHref(locale, "/accessibility")} className="hover:text-slate-300">{t("accessibility")}</Link>
          <Link href={localizedHref(locale, "/non-discrimination")} className="hover:text-slate-300">{t("nonDiscrimination")}</Link>
          <Link href={localizedHref(locale, "/refund-cancellation")} className="hover:text-slate-300">{t("refund")}</Link>
        </div>
        <div className="mt-4 text-xs text-slate-600">© {new Date().getFullYear()} TIAI. All rights reserved.</div>
      </div>
    </footer>
  );
}
