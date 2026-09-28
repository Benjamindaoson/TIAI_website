# Deployment Readiness

## Why

The site is now technically stable, but deployment still depends on manual knowledge. Staging and production need repeatable checks, documented environment variables, and a CI gate that prevents regressions before visual redesign work continues.

## What Changes

- Add a committed `.env.example`.
- Add GitHub Actions CI for tests, lint, build, and production dependency audit.
- Add deployment documentation for Vercel-first staging and Cloudflare considerations.
- Update README to point to the deployment guide.

## Acceptance Criteria

- CI runs on pushes and pull requests to `main`.
- CI uses `npm ci`, `npm test`, `npm run lint`, `npm run build`, and `npm audit --omit=dev --audit-level=moderate`.
- `.env.example` documents all required and optional environment variables without real secrets.
- Deployment docs explain staging setup and post-deploy smoke checks.
