# Audit Notes

After `npm audit fix` and upgrading `next`, `eslint-config-next`, `next-intl`, and `resend`, `npm audit --omit=dev` no longer reports high severity vulnerabilities.

Remaining moderate findings as of 2026-06-23:

- `gray-matter` depends on a vulnerable `js-yaml` range. `npm audit fix --force` would downgrade `gray-matter` to `2.0.1`, which is a breaking change and should be handled in a separate MDX parsing cleanup.
- `next@16.2.9` still reports a nested `postcss <8.5.10` advisory through npm audit. `npm audit fix --force` suggests downgrading Next to `9.3.3`, which is not acceptable for this App Router project.
