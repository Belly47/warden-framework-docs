# Warden Framework v2 documentation

This directory is the Mintlify project root. In Mintlify **Git settings**, connect this repository as a monorepo and set the documentation path to `/docs`.

## Local validation

Run:

```powershell
node docs/scripts/check-docs.js
```

The check validates navigation, source-backed API inventory entries, and the Lua example package when `luac` is available. Preview with `mint dev` after installing the Mintlify CLI.

## Existing-site redirect

Set `NEXT_PUBLIC_WARDEN_DOCS_URL` in `requiem-frontend` to the final Mintlify URL. The existing `/developer/docs` page redirects there once this variable is set.
