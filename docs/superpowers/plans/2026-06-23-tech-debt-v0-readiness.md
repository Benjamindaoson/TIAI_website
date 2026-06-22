# Tech Debt v0 Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove avoidable production technical debt and prepare stable integration points for a future v0 visual refresh.

**Architecture:** Keep the Next.js app behavior unchanged while moving pure logic into tested library modules. Replace the generic YAML parser with a constrained frontmatter parser, improve rate limiting with bounded cleanup, and expose route helpers that v0-generated presentational components can consume.

**Tech Stack:** Next.js 16, React 19, next-intl, Vitest, TypeScript, MDX.

---

## Tasks

### Task 1: Test Harness

**Files:**
- Modify: `package.json`

- [ ] Add `vitest` as a dev dependency.
- [ ] Add `"test": "vitest run"` to scripts.

### Task 2: Parser Tests First

**Files:**
- Create: `src/lib/frontmatter.test.ts`
- Create later: `src/lib/frontmatter.ts`

- [ ] Write tests for quoted strings, string arrays, missing frontmatter, and content extraction.
- [ ] Run `npm test -- src/lib/frontmatter.test.ts` and confirm it fails because implementation is missing.

### Task 3: Rate Limit Tests First

**Files:**
- Modify: `src/lib/rate-limit.ts`
- Create: `src/lib/rate-limit.test.ts`

- [ ] Write tests for fixed-window allowance, blocked requests, reset after expiry, and bucket pruning.
- [ ] Run `npm test -- src/lib/rate-limit.test.ts` and confirm it fails before implementation.

### Task 4: Route Helper Tests First

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/lib/routes.ts`
- Create: `src/lib/routes.test.ts`

- [ ] Write tests for localized root, path, anchor, and locale switching.
- [ ] Run `npm test -- src/lib/routes.test.ts` and confirm it fails before implementation.

### Task 5: Implementation

**Files:**
- Modify: `src/lib/mdx.ts`
- Modify: `src/lib/rate-limit.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/app/[lang]/layout.tsx`
- Modify: `src/proxy.ts`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/MobileMenu.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `package.json`

- [ ] Implement `parseFrontmatter`.
- [ ] Replace `gray-matter` usage.
- [ ] Implement bounded rate limiter and preserve `checkRateLimit` API.
- [ ] Add site config and route helpers.
- [ ] Update components and metadata files to use shared config/helpers.
- [ ] Remove `gray-matter`.
- [ ] Add safe `postcss` override if audit still reports the nested vulnerable version.

### Task 6: Verification

**Files:**
- No file changes unless verification reveals defects.

- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm audit --omit=dev --audit-level=moderate`.
- [ ] Run production smoke tests for `/en`, `/zh`, `/en/blog`, `/robots.txt`, and `/sitemap.xml`.
