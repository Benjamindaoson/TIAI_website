import { describe, expect, it } from "vitest";
import { anchorHref, localizedHref, switchLocaleInPath } from "./routes";
import { legalPageSlugs, staticPageSlugs } from "./site";

describe("route helpers", () => {
  it("builds localized root and path hrefs", () => {
    expect(localizedHref("en")).toBe("/en");
    expect(localizedHref("zh", "/about")).toBe("/zh/about");
    expect(localizedHref("en", "programs/ai-ml")).toBe("/en/programs/ai-ml");
  });

  it("builds localized anchor hrefs", () => {
    expect(anchorHref("en", "contact")).toBe("/en#contact");
    expect(anchorHref("zh", "#partnership")).toBe("/zh#partnership");
  });

  it("switches only the locale segment while preserving path and query", () => {
    expect(switchLocaleInPath("/en/programs/ai-ml?ref=nav", "zh")).toBe("/zh/programs/ai-ml?ref=nav");
    expect(switchLocaleInPath("/", "zh")).toBe("/zh");
    expect(switchLocaleInPath("/faculty", "en")).toBe("/en/faculty");
  });

  it("tracks formal institutional pages for navigation and sitemap coverage", () => {
    expect(staticPageSlugs).toContain("university-partnerships");
    expect(staticPageSlugs).toContain("for-students");
    expect(staticPageSlugs).toContain("admissions");
    expect(staticPageSlugs).toContain("tuition");
    expect(staticPageSlugs).toContain("faq");
    expect(staticPageSlugs).toContain("institutional-disclosures");
    expect(legalPageSlugs).toContain("accessibility");
    expect(legalPageSlugs).toContain("non-discrimination");
    expect(legalPageSlugs).toContain("refund-cancellation");
  });
});
