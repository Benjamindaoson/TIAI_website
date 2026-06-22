# Tech Debt and v0 Readiness

## Why

The production baseline is now stable, but the site still carries avoidable technical debt that will make visual redesign work slower:

- Blog parsing depends on `gray-matter`, which brings a vulnerable `js-yaml` dependency for a very small frontmatter use case.
- The contact rate limiter uses an unbounded module-level map.
- The project has no test runner or automated tests for pure business logic.
- Locale, site URL, slugs, and route construction are duplicated across app files and components.
- v0-generated components need stable props and route helpers so design work does not reintroduce business logic.

## What Changes

- Add a lightweight test runner and tests for parsing, route generation, and rate limiting.
- Replace `gray-matter` with a deterministic frontmatter parser for the current MDX schema.
- Improve the rate limiter with pruning and a bounded bucket count.
- Centralize locale, site URL, and route helpers in small library modules.
- Add npm overrides for safe transitive dependency cleanup.
- Keep visual redesign out of scope.

## Acceptance Criteria

- `npm test` passes.
- `npm run lint` passes.
- `npm run build` passes.
- `npm audit --omit=dev --audit-level=moderate` passes or any remaining moderate finding is documented with a clear non-breaking remediation path.
- Blog list and blog post routes still work.
- `/en`, `/zh`, `/robots.txt`, and `/sitemap.xml` still return HTTP 200 in production mode.
- v0 work can import route helpers and pass data into presentational sections without touching API or parsing logic.
