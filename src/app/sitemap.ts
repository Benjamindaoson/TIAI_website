import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://texasinstituteofai.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
    ...(['ai-ml', 'cs', 'information-systems'] as const).flatMap((slug) =>
      (['en', 'zh'] as const).map((lang) => ({
        url: `${siteUrl}/${lang}/programs/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    ),
    // Blog list pages
    ...(['en', 'zh'] as const).map((lang) => ({
      url: `${siteUrl}/${lang}/blog`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Static content pages
    ...(['faculty', 'about', 'privacy', 'terms'] as const).flatMap((slug) =>
      (['en', 'zh'] as const).map((lang) => ({
        url: `${siteUrl}/${lang}/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    ),
  ];
}
