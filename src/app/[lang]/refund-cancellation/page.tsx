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
  const page = getLaunchPage("refund-cancellation", lang);
  const siteUrl = getSiteUrl();

  return {
    title: `${page.title} | TIAI`,
    description: page.description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/${lang}/refund-cancellation`,
      languages: {
        en: `${siteUrl}/en/refund-cancellation`,
        zh: `${siteUrl}/zh/refund-cancellation`,
      },
    },
  };
}

export default async function RefundCancellationPage({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}) {
  const { lang } = await params;
  return <LaunchPage {...getLaunchPage("refund-cancellation", lang)} />;
}
