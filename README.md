# Texas Institute of Artificial Intelligence Website

Official website for `texasinstituteofai.org`, built with Next.js 16 and `next-intl` (`/en`, `/zh`).

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Domain

Set:

```bash
NEXT_PUBLIC_SITE_URL=https://texasinstituteofai.org
```

This value is used by:
- canonical URLs
- hreflang alternates
- `robots.txt`
- `sitemap.xml`

## Production Environment Variables

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAIL`
- `RESEND_API_KEY`
- `AIRTABLE_BASE_ID` optional
- `AIRTABLE_API_KEY` optional
- `AIRTABLE_TABLE_NAME` optional, defaults to `Contacts`
- `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` optional
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

## Recommended Free Deployment (Cloudflare Pages)

1. Push this repo to GitHub.
2. In Cloudflare Dashboard, create a Pages project from this repo.
3. Build settings:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`
4. Environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://texasinstituteofai.org`
5. Add custom domain:
   - `texasinstituteofai.org`
   - `www.texasinstituteofai.org` (optional, then redirect one to the other)
6. Ensure DNS points to Cloudflare and SSL/TLS is active.

## SEO Checklist (Google + Baidu)

After go-live:

1. Verify these URLs are publicly accessible:
   - `https://texasinstituteofai.org/robots.txt`
   - `https://texasinstituteofai.org/sitemap.xml`
   - `https://texasinstituteofai.org/en`
   - `https://texasinstituteofai.org/zh`
2. Submit sitemap in Google Search Console.
3. Submit sitemap/links in Baidu Search Resource Platform.
4. Keep pages crawlable (no login wall, no `noindex`).

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```
