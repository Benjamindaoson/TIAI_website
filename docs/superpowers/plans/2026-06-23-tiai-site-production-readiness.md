# TIAI Site Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the existing Next.js TIAI website from prototype quality to a safe baseline suitable for staging review and eventual production launch.

**Architecture:** Keep the current Next.js App Router codebase and fix the server/client boundary, lint failures, dependency risk, repository layout, and contact-form abuse controls. Defer full brand redesign to a separate v0-assisted visual refresh after the baseline site is healthy.

**Tech Stack:** Next.js 16, React 19, next-intl, Tailwind CSS 4, Zod, Resend, Airtable REST API, Cloudflare Turnstile.

---

## File Structure

- `D:/tiai-website/tiai-nexus/openspec/` - Create project-local OpenSpec artifacts before implementation.
- `D:/tiai-website/tiai-nexus/src/app/[lang]/page.tsx` - Fix homepage server translation access and locale-aware anchor links.
- `D:/tiai-website/tiai-nexus/src/components/CookieBanner.tsx` - Fix lint issue around state initialization from `localStorage`.
- `D:/tiai-website/tiai-nexus/src/components/ContactForm.tsx` - Add Turnstile token submission, honeypot field, and clearer client error behavior.
- `D:/tiai-website/tiai-nexus/src/app/api/contact/route.ts` - Add bot checks, Cloudflare Turnstile verification, simple rate limiting, and normalized JSON responses.
- `D:/tiai-website/tiai-nexus/src/lib/rate-limit.ts` - Create a small in-memory rate limiter for baseline protection.
- `D:/tiai-website/tiai-nexus/src/lib/turnstile.ts` - Create Turnstile verification helper.
- `D:/tiai-website/tiai-nexus/package.json` and `package-lock.json` - Upgrade vulnerable dependencies.
- `D:/tiai-website/tiai-nexus/README.md` - Document required production environment variables.

## Phase 0: Workspace and Spec Hygiene

### Task 1: Normalize Repository Layout

**Files:**
- Inspect: `D:/tiai-website/.git`
- Inspect: `D:/tiai-website/tiai-nexus`

- [ ] **Step 1: Confirm current Git root and nested project**

Run:

```powershell
git -C D:\tiai-website rev-parse --show-toplevel
git -C D:\tiai-website status --short --branch
Get-ChildItem -Force D:\tiai-website
```

Expected: Git root is `D:/tiai-website`; tracked files appear deleted because actual files are inside `D:/tiai-website/tiai-nexus`.

- [ ] **Step 2: Move project files back to repository root**

Run this only after confirming `D:/tiai-website` contains only `.git` and `tiai-nexus`:

```powershell
$root = 'D:\tiai-website'
$nested = Join-Path $root 'tiai-nexus'
Get-ChildItem -LiteralPath $nested -Force | ForEach-Object {
  Move-Item -LiteralPath $_.FullName -Destination $root
}
Remove-Item -LiteralPath $nested -Force
```

Expected: `package.json`, `src/`, `messages/`, and `content/` are directly under `D:/tiai-website`.

- [ ] **Step 3: Verify Git sees the restored files**

Run:

```powershell
git -C D:\tiai-website status --short --branch
```

Expected: no mass-delete status. Untracked build artifacts such as `.next/`, `node_modules/`, or `next-env.d.ts` may remain and should not be committed unless intentionally tracked.

### Task 2: Create OpenSpec Change

**Files:**
- Create or modify: `D:/tiai-website/openspec/`

- [ ] **Step 1: Initialize OpenSpec if absent**

Run:

```powershell
if (!(Test-Path D:\tiai-website\openspec)) {
  openspec init --tools codex D:\tiai-website
}
```

Expected: `D:/tiai-website/openspec` exists.

- [ ] **Step 2: Create a production-readiness change**

Run:

```powershell
openspec change create tiai-site-production-readiness
```

If the CLI does not support `change create`, create the equivalent files manually under `openspec/changes/tiai-site-production-readiness/`.

- [ ] **Step 3: Record acceptance criteria**

The change must include these acceptance criteria:

```markdown
## Acceptance Criteria

- `/en` and `/zh` return HTTP 200 in `next start`.
- `npm run lint` passes.
- `npm run build` passes.
- `npm audit --omit=dev` has no high severity vulnerabilities.
- Contact form rejects missing or invalid Turnstile tokens in production.
- Contact form keeps Resend and Airtable behavior working for valid submissions.
- Sitemap and robots endpoints return HTTP 200.
```

## Phase 1: Blocking Runtime and Lint Fixes

### Task 3: Fix Homepage Translation Usage

**Files:**
- Modify: `D:/tiai-website/src/app/[lang]/page.tsx`

- [ ] **Step 1: Replace client translation hook with server helper**

Change the imports and translation initialization from:

```tsx
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
```

to:

```tsx
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
```

Change:

```tsx
const t = useTranslations("Landing");
```

to:

```tsx
const t = await getTranslations({ locale: lang, namespace: "Landing" });
```

- [ ] **Step 2: Make homepage hash links locale-aware**

Change homepage-only hash links:

```tsx
<Link href="#partnership">{t("ctaPrimary")}</Link>
<Link href="#faculty">{t("ctaSecondary")}</Link>
```

to:

```tsx
<Link href={`/${lang}#partnership`}>{t("ctaPrimary")}</Link>
<Link href={`/${lang}#faculty`}>{t("ctaSecondary")}</Link>
```

- [ ] **Step 3: Verify homepage now works**

Run:

```powershell
npm run build
$p = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run','start','--','--port','3001') -WorkingDirectory 'D:\tiai-website' -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 5
(Invoke-WebRequest -UseBasicParsing http://localhost:3001/en).StatusCode
(Invoke-WebRequest -UseBasicParsing http://localhost:3001/zh).StatusCode
Stop-Process -Id $p.Id -Force
```

Expected: both status codes are `200`.

### Task 4: Fix Cookie Banner Lint

**Files:**
- Modify: `D:/tiai-website/src/components/CookieBanner.tsx`

- [ ] **Step 1: Replace effect-driven initial visibility with mounted state**

Use this implementation:

```tsx
"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "tiai_cookie_consent";

export default function CookieBanner() {
  const t = useTranslations("Cookie");
  const params = useParams();
  const locale = typeof params.lang === "string" ? params.lang : "en";
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setVisible(!localStorage.getItem(STORAGE_KEY));
  }, [mounted]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 px-4 py-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-4xl">
        <p className="text-slate-300 text-sm flex-1">
          {t("message")}{" "}
          <Link href={`/${locale}/privacy`} className="underline hover:text-white">
            {t("learnMore")}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <Button size="sm" variant="outline" onClick={handleDecline}>{t("decline")}</Button>
          <Button size="sm" onClick={handleAccept}>{t("accept")}</Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run lint**

Run:

```powershell
npm run lint
```

Expected: no `react-hooks/set-state-in-effect` error.

## Phase 2: Contact Form Production Protection

### Task 5: Add Rate Limiter Helper

**Files:**
- Create: `D:/tiai-website/src/lib/rate-limit.ts`

- [ ] **Step 1: Create helper**

```ts
type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}
```

- [ ] **Step 2: Add unit-level smoke command**

Run:

```powershell
npm run lint
```

Expected: TypeScript-aware lint has no import or syntax issues.

### Task 6: Add Turnstile Verification Helper

**Files:**
- Create: `D:/tiai-website/src/lib/turnstile.ts`

- [ ] **Step 1: Create helper**

```ts
interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return process.env.NODE_ENV === "production"
      ? { success: false, error: "Turnstile is not configured" }
      : { success: true };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (remoteIp) formData.append("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return { success: false, error: "Turnstile verification failed" };
  }

  const result = (await response.json()) as TurnstileResponse;
  return result.success
    ? { success: true }
    : { success: false, error: result["error-codes"]?.join(", ") || "Invalid Turnstile token" };
}
```

### Task 7: Harden Contact API

**Files:**
- Modify: `D:/tiai-website/src/app/api/contact/route.ts`

- [ ] **Step 1: Extend schema and imports**

Add imports:

```ts
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
```

Extend schema:

```ts
const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  program: z.enum(["ai-ml", "cs", "information-systems", "partnership", "faculty", "other"]),
  message: z.string().min(1).max(2000),
  lang: z.enum(["en", "zh"]),
  turnstileToken: z.string().optional(),
  company: z.string().max(0).optional(),
});
```

- [ ] **Step 2: Add request protection before sending email**

After validation succeeds, add:

```ts
const ip =
  req.headers.get("cf-connecting-ip") ||
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

const rateLimit = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
if (!rateLimit.allowed) {
  return Response.json({ error: "Too many requests" }, { status: 429 });
}

if (parsed.data.company) {
  return Response.json({ success: true }, { status: 200 });
}

const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken ?? "", ip);
if (!turnstile.success) {
  return Response.json({ error: "Bot verification failed" }, { status: 400 });
}
```

- [ ] **Step 3: Normalize JSON responses**

Replace `new Response(JSON.stringify(...), { status })` with:

```ts
return Response.json({ error: "Invalid JSON" }, { status: 400 });
```

Use `Response.json` consistently for success and error responses.

### Task 8: Add Turnstile to Contact Form

**Files:**
- Modify: `D:/tiai-website/src/components/ContactForm.tsx`
- Modify: `D:/tiai-website/README.md`

- [ ] **Step 1: Include Turnstile script when site key exists**

Import `Script`:

```tsx
import Script from "next/script";
```

Add inside the component:

```tsx
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
```

Render before the form:

```tsx
{turnstileSiteKey && (
  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
)}
```

- [ ] **Step 2: Add honeypot and Turnstile fields to form**

Inside `<form>` before visible fields:

```tsx
<input
  type="text"
  name="company"
  tabIndex={-1}
  autoComplete="off"
  className="hidden"
  aria-hidden="true"
/>
{turnstileSiteKey && (
  <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
)}
```

Before `fetch`, add:

```tsx
const turnstileInput = e.currentTarget.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
const turnstileToken = turnstileInput?.value;
```

Change request body to:

```tsx
body: JSON.stringify({ ...data, lang, turnstileToken }),
```

- [ ] **Step 3: Document required env vars**

Add to `README.md`:

```markdown
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
```

## Phase 3: Dependency and Security Cleanup

### Task 9: Upgrade Vulnerable Dependencies

**Files:**
- Modify: `D:/tiai-website/package.json`
- Modify: `D:/tiai-website/package-lock.json`

- [ ] **Step 1: Apply non-breaking audit fixes**

Run:

```powershell
npm audit fix
```

Expected: lockfile changes.

- [ ] **Step 2: Upgrade Next within a safe current release**

Run:

```powershell
npm install next@latest eslint-config-next@latest next-intl@latest resend@latest
```

Expected: `package.json` and `package-lock.json` update.

- [ ] **Step 3: Re-run audit**

Run:

```powershell
npm audit --omit=dev
```

Expected: no high severity vulnerabilities. If moderate vulnerabilities remain only in MDX/gray-matter dev-like content parsing, document them in the OpenSpec change and decide whether to replace `gray-matter`.

## Phase 4: Verification

### Task 10: Full Local Verification

**Files:**
- No file changes unless verification reveals defects.

- [ ] **Step 1: Clean build artifacts**

Run:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

- [ ] **Step 2: Run lint and build**

Run:

```powershell
npm run lint
npm run build
```

Expected: both pass.

- [ ] **Step 3: Smoke test production server**

Run:

```powershell
$p = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run','start','--','--port','3001') -WorkingDirectory 'D:\tiai-website' -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 5
$paths = @('/en','/zh','/en/about','/zh/about','/en/faculty','/en/programs/ai-ml','/en/blog','/robots.txt','/sitemap.xml')
foreach ($path in $paths) {
  $res = Invoke-WebRequest -UseBasicParsing "http://localhost:3001$path"
  "$path $($res.StatusCode)"
}
Stop-Process -Id $p.Id -Force
```

Expected: every path returns `200`.

- [ ] **Step 4: Verify contact form failure mode without env**

Run:

```powershell
$body = @{
  name = 'Test User'
  email = 'test@example.com'
  program = 'partnership'
  message = 'Testing contact form validation.'
  lang = 'en'
} | ConvertTo-Json
Invoke-WebRequest -UseBasicParsing -Method Post -Uri http://localhost:3001/api/contact -ContentType 'application/json' -Body $body
```

Expected in production with no Turnstile token: HTTP `400` and `Bot verification failed`, unless local non-production bypass is intentionally active.

### Task 11: Commit Baseline Fix

**Files:**
- All modified files from Tasks 1-10.

- [ ] **Step 1: Inspect diff**

Run:

```powershell
git status --short
git diff -- src package.json package-lock.json README.md openspec
```

- [ ] **Step 2: Commit**

Run:

```powershell
git add src package.json package-lock.json README.md openspec docs/superpowers/plans/2026-06-23-tiai-site-production-readiness.md
git commit -m "fix: prepare TIAI site for production baseline"
```

## Phase 5: Separate Visual Refresh Plan

### Task 12: Define v0-Assisted Brand Refresh as a Separate Change

**Files:**
- Create later: `D:/tiai-website/docs/superpowers/plans/YYYY-MM-DD-tiai-brand-refresh.md`
- Create later: `D:/tiai-website/openspec/changes/tiai-brand-refresh/`

- [ ] **Step 1: Do not start visual refresh until production baseline passes**

Gate:

```text
npm run lint passes
npm run build passes
/en and /zh return 200
npm audit --omit=dev has no high severity vulnerabilities
```

- [ ] **Step 2: Use v0 for component-level redesign only**

The visual refresh should redesign:

```text
Homepage hero
Programs overview
Institutional trust section
Faculty/advisor network section
Contact conversion section
```

Do not migrate the site to Framer unless the project intentionally gives up code-level ownership.

## Self-Review

- Spec coverage: The plan covers runtime 500, lint, repository layout, dependencies, contact form protection, verification, and the v0 decision boundary.
- Placeholder scan: No `TBD`, `TODO`, or undefined "handle later" steps remain.
- Type consistency: `turnstileToken`, `company`, `checkRateLimit`, and `verifyTurnstileToken` are defined before use.
