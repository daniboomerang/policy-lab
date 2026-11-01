---
paths:
  - "src/app/**"
  - "src/server/**"
  - "next.config.ts"
  - "vercel.json"
---

# Next.js

**Check the installed version's types and docs before using an API** (`node_modules/next/dist/docs` when present, or the types). Next.js's App Router conventions (async `params`, caching defaults, `next typegen`) have changed between releases. Follow the version in `package.json`, not memory.

## Routes (`src/app/`)
- `layout.tsx`: document shell, fonts (Geist, JetBrains Mono via `next/font/google`), metadata, global CSS, and the chrome: the product name and the honesty badge, on every page.
- `page.tsx`: the Policies tab (the policies table).
- Policy page, draft, simulation, review, history and JSON view: routes under `src/app/policies/` as SPEC.md §1 describes.
- `system/`: the component playground. Every component the app actually uses, in each of its states (default, hover and focus live, disabled, loading, empty, error, and every variant the app renders), on fixture data, with a light/dark switch at the top, plus the full screens on fixtures. One `Section` per component; a component is added to `/system` in the same PR that first uses it, and removed when the app stops using it. Never linked from the app's navigation.
- `dev-stats/`: the development log. The page's server component reads the development snapshot and renders it first, with a line saying when it was taken; the client then polls the two live reads (GitHub and the Vinaya log) with TanStack Query and replaces it in place.
- No other routes in v1.

## Server and client components
- Server components by default. Mark a file `"use client"` only when it needs state, effects, event handlers or browser APIs (the editor, the simulation, the assistant's form).
- The engine runs where its caller runs. The simulation reruns in the browser as the draft changes; nothing about Saifuro needs a server.
- `localStorage`, `matchMedia` and `window` exist only in the browser: read them in effects, never during render.

## The development record (`src/server/`), ported from Onchain Rewind
- `src/server/github/`: the GitHub reader (this repo's issues, issue comments, pull requests and their commits, with optional `GITHUB_TOKEN`), its pure fold, `write-dev-snapshot.ts` (build step) and `check-dev-snapshot-leaks.ts` (build step). `src/server/vinaya/`: the Vinaya log reader (NDJSON, `…/events?after=<seq>`, `Authorization: Bearer VINAYA_LOG_READ_TOKEN`). The folds (dev record, GitHub dev record, the page's view) are pure and live in `src/engine/`, tested on fixtures.
- Every module here starts with `import "server-only"`. Rewind's server functions become route handlers (`src/app/dev-stats/api/…/route.ts`) for the client's polling and direct calls from the page's server component; the logic is unchanged.
- Change Rewind's hard-coded repository and log URL to this repo's. Keep its rules: a source that fails still renders what the other gives, with one message naming what is missing; log lines name the source and status only, never a token, error object, URL or header; recut or dropped Issues are skipped by one named list in the Vinaya reader.
- **The snapshot**: `bun run build` runs the writer before `next build` and the leak check after. The writer reads through the same two readers, never a mapping of its own; writes a gitignored JSON file under `src/server/github/`, never under `public/`; never fails the build (a missing token or failed read writes no snapshot and removes a stale one). The leak check fails the build if the snapshot carries a token's name or value, or `.next/static` a token's value.

## Env
- **No Saifuro variable exists.** Never add one. Saifuro data comes only from `src/saifuro/client.ts` in server code.
- **Pages render on the server.** Routes are server components that read through the Saifuro client and pass view models down; client components only where a screen reacts to input (the draft editor, the simulation, the table's sorting and filters). Writes are server actions.
- `VINAYA_LOG_READ_TOKEN` and `GITHUB_TOKEN` (optional) are server-only, for `/dev-stats`. Read them only in server code: modules that start with `import "server-only"`, server components and route handlers. Documented in `.env.example`; real values in `.env.local` (gitignored).
- **Never prefix a secret with `NEXT_PUBLIC_`**: Next.js inlines `NEXT_PUBLIC_*` into the client bundle.
- **Build check:** after `bun run build`, the last 12 characters of each token's value must not appear under `.next/static`. `ship-check` runs it and prints only "found" or "not found".

## Client data
- TanStack Query for anything fetched on the client (the development log's polling). Sample data is imported, not fetched.

## Production
AGENTS.md rule 11 is canonical: production is Principal-only. This section repeats it for the files that configure a deploy. If the two ever differ, AGENTS.md wins.
- **The only Vercel command an agent may run is `vercel deploy --prod --skip-domain`.** It builds a production-target deployment and does not alias it to the production domain.
- **Anything not named is denied.** That includes `vercel deploy --prod` without `--skip-domain`, `--target=production`, `promote`, `rollback`, `redeploy`, `alias`, `domains`, `link`, `pull`, `git connect`, `env` and `--prebuilt`, every other Vercel command or flag, the Vercel dashboard and API, and every change to environment variables or project settings. They are the Principal's.
- **An unaliased build is still production.** It runs with the production environment variables and its URL is reachable. The URL goes to the Principal and is never published.
- **Enforced by prose and the Principal's project settings, not by a permission rule.** Nothing blocks a violation. The settings the Principal confirms are in SPEC.md §10. An agent that is unsure stops and asks.
- **Build from a clean, reviewed commit.** Run the one allowed command only from a clean working tree at a commit that has been reviewed, so the upload is exactly what the review saw.
- **`.vercelignore` keeps local secret files out of the upload.** The Vercel CLI uses it instead of `.gitignore` when both exist, so it lists every secret path `.gitignore` excludes. Add a path to both files together.
