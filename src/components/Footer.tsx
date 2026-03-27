"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <footer className="bg-slate-900 text-slate-50 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-lg font-semibold mb-4">Texas Institute of Artificial Intelligence</h3>
        <p className="mb-2 text-slate-400">{t("address")}</p>
        <p className="text-sm text-slate-500">{t("nonprofit")}</p>
        <div className="mt-6 flex justify-center gap-6 text-xs text-slate-500">
          <Link href={`/${locale}/privacy`} className="hover:text-slate-300">{t("privacy")}</Link>
          <Link href={`/${locale}/terms`} className="hover:text-slate-300">{t("terms")}</Link>
        </div>
        <div className="mt-4 text-xs text-slate-600">© {new Date().getFullYear()} TIAI. All rights reserved.</div>
      </div>
    </footer>
  );
}
