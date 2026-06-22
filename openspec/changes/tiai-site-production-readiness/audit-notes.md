# Audit Notes

After `npm audit fix` and upgrading `next`, `eslint-config-next`, `next-intl`, and `resend`, `npm audit --omit=dev` no longer reports high severity vulnerabilities.

The follow-up `tech-debt-v0-readiness` change removed the remaining moderate production findings by replacing `gray-matter` with a constrained local frontmatter parser and overriding nested `postcss` to `8.5.15`.

Current verification as of 2026-06-23:

- `npm audit --omit=dev --audit-level=moderate` reports `found 0 vulnerabilities`.
