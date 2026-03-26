"use client";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-slate-900 text-slate-50 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-lg font-semibold mb-4">Texas Institute of Artificial Intelligence</h3>
        <p className="mb-2 text-slate-400">{t("address")}</p>
        <p className="text-sm text-slate-500">{t("nonprofit")}</p>
        <div className="mt-8 text-xs text-slate-600">© {new Date().getFullYear()} TIAI. All rights reserved.</div>
      </div>
    </footer>
  );
}
