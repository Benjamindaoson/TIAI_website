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
  const page = getLaunchPage("faq", lang);
  const siteUrl = getSiteUrl();

  return {
    title: `${page.title} | TIAI`,
    description: page.description,
    alternates: {
      canonical: `${siteUrl}/${lang}/faq`,
      languages: {
        en: `${siteUrl}/en/faq`,
        zh: `${siteUrl}/zh/faq`,
      },
    },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}) {
  const { lang } = await params;
  return <LaunchPage {...getLaunchPage("faq", lang)} />;
}
