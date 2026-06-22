# TIAI Site Production Readiness

## Why

The current site is close to a usable institutional website, but it is blocked from production by a homepage runtime error, lint failures, dependency audit findings, weak contact form abuse controls, and a previously inconsistent repository layout.

## What Changes

- Restore the project to the repository root.
- Fix the homepage Next.js server/client translation boundary.
- Fix lint failures.
- Add baseline bot and rate-limit protection to the contact form.
- Upgrade vulnerable dependencies.
- Document required production environment variables.
- Verify the production server routes before considering the baseline complete.

## Acceptance Criteria

- `/en` and `/zh` return HTTP 200 in `next start`.
- `npm run lint` passes.
- `npm run build` passes.
- `npm audit --omit=dev` has no high severity vulnerabilities.
- Contact form rejects missing or invalid Turnstile tokens in production.
- Contact form keeps Resend and Airtable behavior working for valid submissions.
- Sitemap and robots endpoints return HTTP 200.
