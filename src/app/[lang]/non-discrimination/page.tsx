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
  const page = getLaunchPage("non-discrimination", lang);
  const siteUrl = getSiteUrl();

  return {
    title: `${page.title} | TIAI`,
    description: page.description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/${lang}/non-discrimination`,
      languages: {
        en: `${siteUrl}/en/non-discrimination`,
        zh: `${siteUrl}/zh/non-discrimination`,
      },
    },
  };
}

export default async function NonDiscriminationPage({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}) {
  const { lang } = await params;
  return <LaunchPage {...getLaunchPage("non-discrimination", lang)} />;
}
