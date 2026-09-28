import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import zh from "../../messages/zh.json";

describe("site content", () => {
  it("has formal audience pages in both locales", () => {
    for (const messages of [en, zh]) {
      expect(messages.Navigation).toHaveProperty("universities");
      expect(messages.Navigation).toHaveProperty("students");
      expect(messages.Navigation).toHaveProperty("mobileMenu");
      expect(messages).toHaveProperty("UniversityPartnerships");
      expect(messages).toHaveProperty("ForStudents");
    }
  });

  it("describes program boundaries without unconditional credit or admission promises", () => {
    for (const messages of [en, zh]) {
      for (const program of Object.values(messages.Programs)) {
        expect(program).toHaveProperty("details");
        expect(program.details).toHaveProperty("disclaimer");
        expect(program.details.disclaimer.length).toBeGreaterThan(20);
      }
    }
  });

  it("has a user-safe contact form error message", () => {
    expect(en.Contact.errorMessage).toContain("could not send");
    expect(zh.Contact.errorMessage).toContain("未能发送");
  });

  it("includes privacy consent and localized 404 copy", () => {
    expect(en.Contact.privacyConsent).toContain("<privacy>");
    expect(zh.Contact.privacyConsent).toContain("<privacy>");
    expect(en).toHaveProperty("NotFound");
    expect(zh).toHaveProperty("NotFound");
  });
});
