export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const programSlugs = ["ai-ml", "cs", "information-systems"] as const;
export const staticPageSlugs = [
  "faculty",
  "about",
  "university-partnerships",
  "for-students",
  "admissions",
  "tuition",
  "faq",
  "institutional-disclosures",
] as const;
export const legalPageSlugs = [
  "privacy",
  "terms",
  "accessibility",
  "non-discrimination",
  "refund-cancellation",
] as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://texasinstituteofai.org";
}
