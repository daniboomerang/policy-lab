# Next.js, Tailwind v4 and shadcn/ui on Base UI

The app is built on **Next.js (App Router)** with React 19 and TypeScript strict, styled with **Tailwind CSS v4**, with every component from **shadcn/ui's Base UI flavour** (`components.json`: style `base-nova`), so the primitives underneath are **Base UI** (`@base-ui/react`). shadcn components live in `src/components/ui/` and are added one at a time, only when a screen needs one. Every table is shadcn's **Data Table**: TanStack Table (`@tanstack/react-table`, v8 as shadcn's guide uses) with shadcn's `Table`, as in shadcn's tasks example, as one shared component. Versions are pinned exactly.

## Considered options

- **TanStack Start, as Onchain Rewind uses.** Rejected for this app: Policy Lab's one server need is the development record (ADR-0007), which server components and route handlers cover, and Next.js on Vercel is the most direct path to the deploy.
- **Hand-built wrappers over Base UI, or a custom design-system class set.** Rejected: more code to own and review for no product gain; the owner's call is plain shadcn.
- **shadcn/ui on Radix.** Rejected: the shadcn CLI offers a Base UI flavour, and Base UI's `render` prop composes without `asChild`.
- **Next.js + Tailwind v4 + shadcn (Base UI flavour).** Chosen: one deployable, accessible primitives, components copied in as owned code, and a token set that is exactly shadcn's.

## Consequences

- A Biome `noRestrictedImports` rule bans `@base-ui/react` (and its subpaths and old package name) outside `src/components/ui/`. It is a lint error, so CI fails on it.
- The bootstrap installs no components. A task that needs one adds it with the shadcn CLI, pins any dependency the CLI added, and runs `bun run fix`.
- Server components are the default; a component becomes a client component only when it needs state, effects or browser APIs.
- `next typegen` runs before `tsc` in `check:types`, so route types and `next-env.d.ts` exist in CI without a build.
- Every screen works down to 390px wide.
- `/system` shows every component the app uses, in its states, on fixtures, as Onchain Rewind's does; a component the app doesn't use is neither installed nor shown.
