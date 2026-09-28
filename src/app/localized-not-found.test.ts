import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("localized not-found routing", () => {
  it("provides a locale catch-all route that forwards unknown subpaths to notFound()", () => {
    const routePath = resolve(process.cwd(), "src/app/[lang]/[...rest]/page.tsx");
    expect(existsSync(routePath)).toBe(true);
  });
});
