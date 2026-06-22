import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter", () => {
  it("extracts metadata and content from an MDX document", () => {
    const result = parseFrontmatter(`---
title: "Welcome to TIAI"
date: "2026-03-26"
author: "TIAI Editorial"
tags: ["announcement", "ai"]
excerpt: "Launch note"
---

# Welcome

Body copy.`);

    expect(result.data).toEqual({
      title: "Welcome to TIAI",
      date: "2026-03-26",
      author: "TIAI Editorial",
      tags: ["announcement", "ai"],
      excerpt: "Launch note",
    });
    expect(result.content).toBe("# Welcome\n\nBody copy.");
  });

  it("returns empty metadata when frontmatter is absent", () => {
    const result = parseFrontmatter("# Plain Post\n\nNo metadata.");

    expect(result.data).toEqual({});
    expect(result.content).toBe("# Plain Post\n\nNo metadata.");
  });

  it("ignores unsupported lines instead of evaluating YAML aliases", () => {
    const result = parseFrontmatter(`---
title: Safe
alias: &anchor value
merged: *anchor
tags: []
---
Content`);

    expect(result.data).toEqual({
      title: "Safe",
      tags: [],
    });
    expect(result.content).toBe("Content");
  });
});
