import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/site", async () => {
  const actual = await vi.importActual<typeof import("../lib/site")>("../lib/site");
  return actual;
});
vi.mock("@/lib/mdx", () => ({
  getAllSlugs: () => [
    { slug: "welcome", lang: "en" },
    { slug: "welcome", lang: "zh" },
  ],
}));

describe("sitemap", () => {
  it("includes role-specific pages and localized blog posts", async () => {
    const { default: sitemap } = await import("./sitemap");
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://texasinstituteofai.org/en/university-partnerships");
    expect(urls).toContain("https://texasinstituteofai.org/zh/university-partnerships");
    expect(urls).toContain("https://texasinstituteofai.org/en/for-students");
    expect(urls).toContain("https://texasinstituteofai.org/zh/for-students");
    expect(urls).toContain("https://texasinstituteofai.org/en/admissions");
    expect(urls).toContain("https://texasinstituteofai.org/zh/admissions");
    expect(urls).toContain("https://texasinstituteofai.org/en/institutional-disclosures");
    expect(urls).toContain("https://texasinstituteofai.org/zh/institutional-disclosures");
    expect(urls).toContain("https://texasinstituteofai.org/en/blog/welcome");
    expect(urls).toContain("https://texasinstituteofai.org/zh/blog/welcome");
  });

  it("adds hreflang alternates for localized static pages", async () => {
    const { default: sitemap } = await import("./sitemap");
    const admissions = sitemap().find((entry) => entry.url === "https://texasinstituteofai.org/en/admissions");

    expect(admissions?.alternates?.languages).toEqual({
      en: "https://texasinstituteofai.org/en/admissions",
      zh: "https://texasinstituteofai.org/zh/admissions",
    });
  });
});
