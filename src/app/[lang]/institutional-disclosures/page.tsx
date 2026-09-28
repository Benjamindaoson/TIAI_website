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
  const page = getLaunchPage("institutional-disclosures", lang);
  const siteUrl = getSiteUrl();

  return {
    title: `${page.title} | TIAI`,
    description: page.description,
    alternates: {
      canonical: `${siteUrl}/${lang}/institutional-disclosures`,
      languages: {
        en: `${siteUrl}/en/institutional-disclosures`,
        zh: `${siteUrl}/zh/institutional-disclosures`,
      },
    },
  };
}

export default async function InstitutionalDisclosuresPage({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}) {
  const { lang } = await params;
  return <LaunchPage {...getLaunchPage("institutional-disclosures", lang)} />;
}
