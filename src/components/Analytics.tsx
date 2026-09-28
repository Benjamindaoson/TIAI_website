"use client";
import { useSyncExternalStore } from "react";
import Script from "next/script";

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
  return "";
}

export default function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!token || consent !== "accepted") return null;
  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  );
}
