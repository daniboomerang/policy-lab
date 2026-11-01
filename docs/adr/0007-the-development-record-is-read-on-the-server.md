# The development record is read on the server

This app's own build history — how it was built, not what it does — is read on the **server**, from this repo's GitHub issues and pull requests and from its Vinaya log, and folded into a round-by-round record per task plus the guardrail totals, shown at `/dev-stats`. Only that trimmed, aggregated result reaches the browser; no raw log event, GitHub response or token does. The readers and folds are ported from Onchain Rewind, which built the same page.

## Considered options

- **Read the log and GitHub from the browser.** Rejected: the log's read token would ship in the client bundle, and any visitor could read the raw event stream with no aggregation in front of it.
- **A static record checked into the repo.** Rejected: it goes stale between commits, which defeats showing how the app is being built, and needs its own regeneration job.
- **Read on the server.** Chosen: `VINAYA_LOG_READ_TOKEN` and `GITHUB_TOKEN` are read only in server code (server components and route handlers, modules marked `server-only`); the fold from raw events to the record is pure, so it is tested on fixtures with no network call, the same layering ADR-0004 uses for Saifuro data.

## Consequences

- Both tokens are server-only, read-only, documented in `.env.example`, never prefixed `NEXT_PUBLIC_`, never logged and never returned to the client. `ship-check` greps the client build for their values.
- A failed read of one source still renders what the other gives, with one line naming what is missing.
- The Rewind code is ported, not imported: the hard-coded repository and log URL change to this repo's, and the port follows Next.js idioms (server components and route handlers rather than server functions).
- This is the one part of the app that reads a live upstream; it is about the build, never about Saifuro.
