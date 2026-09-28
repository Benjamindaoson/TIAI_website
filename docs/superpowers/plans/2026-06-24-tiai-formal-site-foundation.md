# TIAI Formal Site Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current Next.js site a credible first official website foundation for TIAI without inventing unsupported institutional facts.

**Architecture:** Keep the existing App Router and `next-intl` model. Add role-specific routes for universities and students, strengthen structured route metadata, and repair the design tokens so shared UI components render accessibly on every page.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, next-intl, local JSON messages, local MDX posts, Vitest.

---

## Files

- Modify: `src/lib/site.ts` for route constants.
- Modify: `src/lib/routes.test.ts` for route helper expectations.
- Modify: `src/app/sitemap.ts` and add/modify tests for sitemap behavior.
- Modify: `src/app/[lang]/blog/page.tsx` for blog metadata.
- Create: `src/app/[lang]/university-partnerships/page.tsx`.
- Create: `src/app/[lang]/for-students/page.tsx`.
- Modify: `messages/en.json` and `messages/zh.json` for new content and safer claims.
- Modify: `src/components/Header.tsx` and `src/components/MobileMenu.tsx`.
- Modify: `src/components/ProgramPage.tsx`.
- Modify: `src/app/globals.css` for theme tokens.
- Modify: `src/components/CookieBanner.tsx` and `src/components/Analytics.tsx`.
- Modify: `src/components/ContactForm.tsx`.

## Task 1: Route and Sitemap Tests

- [x] Add failing tests for route constants and sitemap coverage.
- [x] Run `npm test -- src/lib/routes.test.ts src/app/sitemap.test.ts`.
- [x] Implement the minimal route/sitemap changes.
- [x] Re-run the same tests.

## Task 2: Content and Pages

- [x] Add message namespaces for `UniversityPartnerships` and `ForStudents`.
- [x] Create the two pages using existing server component patterns.
- [x] Update metadata for each new page.
- [x] Verify routes return 200 after dev server starts.

## Task 3: Formal Navigation

- [x] Remove duplicate Programs nav link.
- [x] Add University Partnerships and For Students to desktop and mobile nav.
- [x] Keep Contact as the primary utility CTA.
- [x] Verify generated links in English and Chinese.

## Task 4: Visual Foundation

- [x] Define Tailwind theme color tokens in `globals.css`.
- [x] Ensure About, Blog, Faculty, Programs, Terms, and Privacy all render readable text.
- [x] Keep the restrained institutional dark theme where appropriate.
- [x] Verify desktop and mobile screenshots.

## Task 5: Program and Claim Safety

- [x] Expand program pages with audience, format, timeline, assessment, application, outcomes, and disclaimer sections.
- [x] Replace unsupported hard promises with conditional, institution-approved wording.
- [x] Reduce “world-class” and “official launch with partners” claims in MDX posts unless backed by facts.

## Task 6: Cookie, Analytics, and Contact UX

- [x] Make cookie banner buttons readable.
- [x] Load analytics only after accepted consent.
- [x] Map contact server configuration failures to user-safe form text.
- [x] Keep API validation behavior intact.

## Task 7: Verification

- [x] Run `npm run test`.
- [x] Run `npm run lint`.
- [x] Run `npx tsc --noEmit`.
- [x] Run `npm run build`.
- [x] Run `npm audit --omit=dev --audit-level=moderate`.
- [x] Start local dev server and smoke-test core routes and screenshots.

## Self-Review

- No generated facts about people, partner institutions, accreditation, rankings, awards, or funding.
- No platform migration.
- No dependency changes unless commands force it.
- No deployment and no Git commit.
