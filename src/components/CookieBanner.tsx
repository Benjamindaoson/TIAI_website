"use client";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { localizedHref } from "@/lib/routes";

const STORAGE_KEY = "tiai_cookie_consent";
const CONSENT_EVENT = "tiai_cookie_consent_change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot() {
  return "accepted";
}

export default function CookieBanner() {
  const t = useTranslations("Cookie");
  const params = useParams();
  const locale = typeof params.lang === "string" ? params.lang : "en";
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const visible = !consent;

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 px-4 py-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-4xl">
        <p className="text-slate-300 text-sm flex-1">
          {t("message")}{" "}
          <Link href={localizedHref(locale, "/privacy")} className="underline hover:text-white">
            {t("learnMore")}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <Button size="sm" variant="outline" className="border-slate-500 text-slate-100 hover:bg-slate-800" onClick={handleDecline}>{t("decline")}</Button>
          <Button size="sm" className="bg-amber-400 text-slate-950 hover:bg-amber-300" onClick={handleAccept}>{t("accept")}</Button>
        </div>
      </div>
    </div>
  );
}
