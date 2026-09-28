import type { Metadata } from "next";
import LaunchPage from "@/components/LaunchPage";
import { getLaunchPage } from "@/lib/launch-pages";
import { getSiteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = getLaunchPage("accessibility", lang);
  const siteUrl = getSiteUrl();

  return {
    title: `${page.title} | TIAI`,
    description: page.description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/${lang}/accessibility`,
      languages: {
        en: `${siteUrl}/en/accessibility`,
        zh: `${siteUrl}/zh/accessibility`,
      },
    },
  };
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}) {
  const { lang } = await params;
  return <LaunchPage {...getLaunchPage("accessibility", lang)} />;
}
