import { describe, expect, it } from "vitest";
import { getLaunchPage, launchPageSlugs } from "./launch-pages";

describe("launch information pages", () => {
  it("has bilingual launch-critical pages without unsupported promises", () => {
    for (const slug of launchPageSlugs) {
      for (const locale of ["en", "zh"] as const) {
        const page = getLaunchPage(slug, locale);
        expect(page.title.length).toBeGreaterThanOrEqual(3);
        expect(page.sections.length).toBeGreaterThan(0);
        const text = `${page.title} ${page.description} ${page.sections.map((section) => `${section.title} ${section.body}`).join(" ")}`;
        expect(text).not.toMatch(/guaranteed admission|guaranteed transfer|guaranteed employment/i);
      }
    }
  });

  it("keeps unconfirmed operating details explicit", () => {
    const tuition = getLaunchPage("tuition", "en");
    const disclosures = getLaunchPage("institutional-disclosures", "en");

    expect(tuition.sections.some((section) => section.body.includes("founder confirmation"))).toBe(true);
    expect(disclosures.sections.some((section) => section.body.includes("does not grant degrees"))).toBe(true);
  });
});
