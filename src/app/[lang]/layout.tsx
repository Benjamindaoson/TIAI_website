import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const locales = ["en", "zh"] as const;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://texasinstituteofai.org";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = locales.includes(lang as (typeof locales)[number]) ? lang : "en";

  const title =
    locale === "zh"
      ? "德州人工智能学院 | Texas Institute of Artificial Intelligence"
      : "Texas Institute of Artificial Intelligence";

  const description =
    locale === "zh"
      ? "TIAI 是美国得州非营利机构，聚焦 AI、计算机科学与信息系统教育合作。"
      : "TIAI is a Texas nonprofit focused on AI, Computer Science, and Information Systems education partnerships.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        zh: `${siteUrl}/zh`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: "TIAI",
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-950`}>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
