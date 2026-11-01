# The development log paints a build-time snapshot first

The build reads the development record once, through the same two server readers the live page calls, and writes it as the **development snapshot**, a file the deploy carries in its server bundle. A cold visit to `/dev-stats` paints that snapshot from the server's own markup, with a line saying when it was taken, and the page's live reads replace it in place once both answer. The live read of [ADR-0007](0007-the-development-record-is-read-on-the-server.md) is unchanged. This is the design Onchain Rewind arrived at after its live-only page showed a cold visitor 15 to 20 seconds of loader.

## Considered options

- **Live only.** Rejected: a cold serverless instance holds nothing, so the first visit re-reads GitHub (two calls per pull request, one after another) and shows a long loader. A reviewer arriving alone meets an empty page, and a serverless `/tmp` cache doesn't persist between invocations.
- **Edge cache headers.** Rejected: the first visitor after each expiry still pays the full read, and a page polled every few seconds would either serve stale responses or bypass the cache.
- **A persistent store.** Rejected: a database to hold one record adds a service, credentials and a writer for data the build can already read.
- **A build-time snapshot, then the live read.** Chosen: the build already runs on every deploy and can read both sources, and the readers already produce exactly the record the page shows.

## Consequences

- `bun run build` runs `src/server/github/write-dev-snapshot.ts` before `next build`, and `check-dev-snapshot-leaks.ts` after it. The writer calls the two live readers, never a second mapping, so the snapshot cannot drift from the live record.
- The build needs the same read-only tokens as the runtime, `VINAYA_LOG_READ_TOKEN` and `GITHUB_TOKEN`. Without them, or with a source rate limited or unreachable, the build still passes and writes no snapshot (removing a stale one); without the log token the snapshot is written from GitHub alone.
- The build's log line names the source and its status only: never a token, an error object, a URL or a header.
- The snapshot is generated, gitignored and never under `public/`; only server code reads it, so it reaches the browser only as the page's rendered record. The leak check fails the build when the snapshot carries a token's name or value, or the client output a token's value; `ship-check` runs the same check.
- The page says when the snapshot was taken, printed in UTC on the server and switched to the viewer's zone after hydration, so the markup never mismatches. The snapshot's "working on it now" line is left out, because it was only true when the build ran.
- A failed live read keeps the snapshot on screen and says so. The poll interval and the live reads are unchanged.
