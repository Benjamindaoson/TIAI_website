# TIAI Formal Site Foundation

## Summary

Prepare the current Next.js site to serve as a credible first public website for Texas Institute of Artificial Intelligence by fixing launch-blocking visual, information architecture, content-risk, SEO, and contact-flow issues.

## Motivation

The current site builds and runs, but it still reads like an early landing page. Several pages have severe color contrast problems, the navigation does not match the institution's multi-audience role, student and university partnership content is too shallow, and some wording may imply outcomes or partnerships that are not yet supported by public evidence.

## Scope

- Fix the design token mismatch that makes subpages unreadable.
- Replace landing-page-style navigation with a formal institution navigation.
- Add first-class pages for university partnerships and students.
- Improve program pages with clearer audience, format, timeline, assessment, application, and disclaimer sections.
- Reduce unsupported claims in public content.
- Improve SEO metadata, sitemap coverage, and social metadata.
- Improve cookie and contact-form user experience without changing providers.

## Out of Scope

- No platform migration.
- No dependency upgrades unless required by an existing command failure.
- No fabricated people, partner universities, awards, rankings, research output, accreditation, or donor data.
- No deployment or Git commit.

## Acceptance Criteria

- `npm run test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm audit --omit=dev --audit-level=moderate` pass.
- `/en`, `/zh`, `/en/about`, `/en/university-partnerships`, `/en/for-students`, `/en/programs/ai-ml`, `/en/programs/cs`, `/en/programs/information-systems`, `/en/blog`, `/robots.txt`, and `/sitemap.xml` return HTTP 200 locally.
- Desktop and mobile screenshots show readable text on homepage, About, and program pages.
- Header navigation no longer duplicates Programs and exposes University Partnerships and For Students.
- Program CTAs navigate to the contact section without broken routes.
- Blog list has its own canonical URL and sitemap includes article URLs.
