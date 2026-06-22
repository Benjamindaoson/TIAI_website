import type { MetadataRoute } from "next";
import { getSiteUrl, locales, programSlugs, staticPageSlugs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const siteUrl = getSiteUrl();

  return [
    {
      url: `${siteUrl}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          zh: `${siteUrl}/zh`,
        },
      },
    },
    {
      url: `${siteUrl}/zh`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          zh: `${siteUrl}/zh`,
        },
      },
    },
    // Course pages
    ...programSlugs.flatMap((slug) =>
      locales.map((lang) => ({
        url: `${siteUrl}/${lang}/programs/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    ),
    // Blog list pages
    ...locales.map((lang) => ({
      url: `${siteUrl}/${lang}/blog`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Static content pages
    ...staticPageSlugs.flatMap((slug) =>
      locales.map((lang) => ({
        url: `${siteUrl}/${lang}/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    ),
  ];
}
