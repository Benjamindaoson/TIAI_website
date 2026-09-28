# Deployment Guide

## Recommended Staging Path: Vercel

Use Vercel first for staging because this app uses Next.js App Router plus an API route at `/api/contact`.

1. Import `Benjamindaoson/TIAI_website` into Vercel.
2. Keep the framework preset as `Next.js`.
3. Keep the install command as `npm ci`.
4. Keep the build command as `npm run build`.
5. Add environment variables from `.env.example`.
6. Deploy to a Vercel preview URL first.
7. Smoke test:
   - `/en`
   - `/zh`
   - `/en/blog`
   - `/robots.txt`
   - `/sitemap.xml`
   - contact form submission with Turnstile

## Required Production Variables

```text
NEXT_PUBLIC_SITE_URL
ADMIN_EMAIL
RESEND_API_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

## Optional Production Variables

```text
AIRTABLE_BASE_ID
AIRTABLE_API_KEY
AIRTABLE_TABLE_NAME
NEXT_PUBLIC_CF_ANALYTICS_TOKEN
```

## Cloudflare Notes

Cloudflare Pages is a good static-site host, but this project is not purely static: it includes `/api/contact` and server-rendered App Router routes. For Cloudflare hosting, use a Next.js SSR-compatible path such as OpenNext for Cloudflare Workers, or move `/api/contact` to a separate Worker/API service before using a static-only Pages setup.

## Pre-Launch Checklist

Run locally before connecting the production domain:

```bash
npm ci
npm test
npm run lint
npm run build
npm audit --omit=dev --audit-level=moderate
```

The app intentionally uses system fonts instead of `next/font/google` so CI and production builds do not depend on build-time access to Google Fonts.

After deployment, verify:

- The deployed `/en` and `/zh` pages return HTTP 200.
- `NEXT_PUBLIC_SITE_URL` matches the real public domain.
- `robots.txt` and `sitemap.xml` use the real domain.
- Turnstile appears on the contact form.
- Invalid or missing Turnstile tokens are rejected.
- Valid contact submissions send Resend email.
- Airtable receives records if Airtable variables are configured.
