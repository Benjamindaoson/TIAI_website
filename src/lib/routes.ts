import { defaultLocale, isLocale, type Locale } from "./site";

export function localizedHref(locale: string, path = "") {
  const safeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const normalizedPath = normalizePath(path);
  return `/${safeLocale}${normalizedPath}`;
}

export function anchorHref(locale: string, anchor: string) {
  const id = anchor.replace(/^#/, "");
  return `${localizedHref(locale)}#${id}`;
}

export function switchLocaleInPath(currentPath: string, nextLocale: string) {
  const safeLocale: Locale = isLocale(nextLocale) ? nextLocale : defaultLocale;
  const url = new URL(currentPath || "/", "https://local.tiai");
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = safeLocale;
  } else {
    segments.unshift(safeLocale);
  }

  const pathname = `/${segments.join("/")}`;
  return `${pathname}${url.search}${url.hash}`;
}

function normalizePath(path: string) {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}
