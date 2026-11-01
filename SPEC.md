# Policy Lab: spec

## 0. Objectives

**Goal:** ship a demo-ready Policy Lab. A public URL shows the Policies tab of an agent-spend console, built against Saifuro's public API reference and run on labelled sample data: a controller drafts a policy in plain words, replays the last 30 days of decisions against the draft, reviews the change in plain words, publishes a new version and reads its history, at production quality (craft, accessibility, performance, clean architecture), built through governed AI agents.

**Success criteria** (the Milestone is done when all of these hold):
1. A policy can be drafted with the assistant, edited in the form, simulated against 30 days of sample decisions, reviewed, published as a new version, compared with an earlier version and rolled back, end to end on the deployed URL.
2. The engine follows Saifuro's documented evaluation order and multi-mandate rule, proven by tests taken from the docs' own examples (`.claude/rules/policy-engine.md`).
3. The quality bar in §7 holds: checks, tests and build are green; keyboard, reduced motion and 390px widths work; no Saifuro call or key exists anywhere.
4. `/system` shows every component the app uses, in each of its states, on fixtures, in both themes.
5. `/dev-stats` shows this repo's development record, read on the server, painting the build-time snapshot first.
6. Every task merged through a PR with Vinaya's gates and a human Test Plan tick.

**Time box:** building stops Monday 2 November 2026, 18:00 Thai time (UTC+7). What isn't done by then is dropped, not rushed.

The milestone that tracks this goal lives on the forge.

## 1. Product

**One line:** spending policies for AI agents, drafted, tested and published.

**Problem:** an agent that can spend needs written authority, and Saifuro writes it down as mandates: one per agent, immutable, changed only by revoke and create, managed over an API. A finance controller managing many agents needs to say "these agents may spend this much, on this, and a person approves above that" once, see what it would have done before it goes live, and read who changed what afterwards. The API has no policy object and no simulation; the console adds both.

**For:** a finance controller, not an engineer. Engineers get the JSON view.

**The model** (CONTEXT.md):
- An **agent** is created by developers, outside this console. A new agent has no mandate and cannot spend: every request is `deny_no_mandate`.
- A **mandate** is Saifuro's real per-agent permission: one agent, immutable, revoke plus create to change, fields from `MandateCreate`.
- A **policy** is the console's layer: a reusable named set of mandate terms (`Omit<MandateCreate, "agent">`) with a name, a version, the agents it is assigned to, and console-only extras: **approved vendors** (tagged "Not enforced by the API yet") and **Slack notify**.
- Assigning a policy to N agents is N mandates, and each agent gets its own limits; there is no shared budget. Publishing a new version revokes those mandates and creates new ones: 30-day totals restart, and payments waiting for approval under the old mandates can no longer be approved.
- **Custom mandates**, made over the API rather than from a policy, are shown too, read-only.

**Screens:**
1. **Policies (home):** a table of policies: name, version, live or draft, assigned agents, the limits in one phrase ("Up to 50 USDC per payment · 500 per 30 days"), last published by and when. Agents with only custom mandates, and agents with no mandate ("Can't spend: no mandate"), are listed so nothing is hidden.
2. **Policy page:** the policy in one sentence ("Each assigned agent may spend up to **50 USDC** per payment and **500 USDC** in any 30 days, only on **data**. Anything over **20 USDC** waits for **the finance controller**. Ends **31 Dec 2026**."), its assigned agents and the mandate each one holds (id, status, created), the approved vendors and Slack notify, and entry points to edit, history and JSON.
3. **Assistant:** the controller describes the policy in plain words; the assistant fills the form through structured output; the person reviews. The form is the truth: the assistant never publishes and never changes a field the person has edited without saying so (the Stripe Radar Assistant pattern, `design/RESEARCH-rule-uis.md`).
4. **Draft form:** one plain question per field (who it applies to, how much per payment, how much in any 30 days, which categories, above what a person approves, until when), with the changed values marked "was 20". Invalid combinations are said in words (for example, a per-payment limit above the 30-day limit).
5. **Simulation** (beside the form, updating as it changes): "Last 30 days: 412 decisions. With this draft, 9 would change." Groups such as "8 waited for you → paid" and "1 paid → blocked · 30-day limit reached sooner", each opening its decisions: time, agent, recipient, amount, before → after, and a trace line naming the gate. Also the workload: "Waited for you per week: 6 → 2". Labelled "Simulation on sample data".
6. **Review:** the change in plain words, then the consequences: "Publishing makes this version 3. Version 2's mandates are revoked and new ones are created for 4 agents. 30-day totals restart. Payments waiting for approval under version 2 can no longer be approved." An optional note ("why").
7. **History:** a timeline of versions (number, live or replaced, who, when, note). Compare any two: both sentences, and the change in words ("Approval above 20 → 40 USDC; everything else unchanged"). "Roll back to this version" publishes it again as a new version; history is never rewritten.
8. **JSON view:** the exact `POST /v1/mandates` bodies, one per assignment, and the `POST /v1/mandates/{id}/revoke` calls a publish would make, labelled "Not sent: this demo is not connected to Saifuro".
9. **Component playground** (`/system`): every component the app actually uses — and only those — each in its states (default, hover and focus live, disabled, loading, empty, error, every variant the app renders), on fixture data, with a light/dark switch at the top, then the full screens on fixtures. A component joins `/system` in the PR that first uses it. Not linked from the app's navigation.
10. **Development log** (`/dev-stats`), exactly as Onchain Rewind's, ported from it: this project's own development record (CONTEXT.md) as a product surface — the milestone's progress, the headline numbers, where the time goes between the developer and the reviewers, the guardrail totals, a live "working on it now" line, and every ticket with its rounds expanding to a round-by-round timeline. Read on the server from GitHub and the Vinaya log, polled every few seconds from the client; times in the viewer's own zone. A cold visit paints the development snapshot first — the record as the last deploy's build read it through the same two readers, with a line saying when it was taken — and the live record replaces it in place. When one source fails, the page still renders everything the other gives, with one message naming what is missing and why. Dropped or recut Issues are skipped by one named list. Ends with "Made with Vinaya". The port is a feature task, not part of the bootstrap: Rewind's readers, folds, snapshot writer and leak check, with this repo's name and log URL, server functions turned into route handlers and server-component reads.

**Words in the UI:** outcomes are **paid**, **waited for you** and **blocked**; "mandate" for Saifuro's object and "policy" for ours, never "rule". Limits are always "per agent". Sentence case, no exclamation marks.

**Chrome:** "Policy Lab" and the honesty badge "Demo · sample data · not connected to Saifuro" on every page. Below it, the console's five tabs (Agents · Payments · Policies · Escrow · Reports): Policies is active, the other four are muted and not clickable, with the tag "Only Policies is part of this demo". No Saifuro name or logo anywhere else in the chrome. Footer: "Sample data · the engine follows Saifuro's public API docs · not connected to Saifuro."

**States:** no policies yet; a draft that changes nothing ("This draft changes nothing in the last 30 days"); an agent with no mandate; invalid values said in words; the assistant unable to draft (the form stays usable by hand); reduced motion; keyboard only; light and dark; 390px wide.

**Platform:** desktop-first web app (1440×900), working down to 390 wide.

## 2. Non-goals (this build)

No calls to Saifuro and no Saifuro keys of any kind. No agent creation or key management. No review queue (reviews can't be read over the API). No escrow, signature verification, webhooks registration, ledger or onchain views. No accounts, sign-in or database: policies and drafts live in the browser session on top of the sample data.

**Later** (don't build these): shared budgets across agents (the API has none), recipient enforcement (the API has none), policy templates library, shadow mode.

## 3. Design input

- The **Policy Lab Design System**, linked from [`design/DESIGN.md`](design/DESIGN.md): the look, the screens and the component inventory. The app uses plain shadcn/ui (Base UI flavour) on shadcn's own variables; the design system's own class names are not used.
- `design/marketing-literal-palette.txt` and `design/docs-theme-vars.txt`: the palette sources behind the token values.
- `design/RESEARCH-rule-uis.md`: how the best spend-rule screens work, and which pattern goes where.

All three files are read-only. `design/DESIGN.md` is a living doc.

## 4. Architecture

```
Server (Next.js, SSR)                                          Browser
─────────────────────                                          ───────
app/ routes (server components)
  ├─ saifuro/client.ts  GET /agents · /mandates · /decisions · /usage
  │     └─ fetch = mockFetch (saifuro/mock/) ── seed data + visitor's publishes (httpOnly cookie)
  ├─ engine/ (pure): responses → view models ─────────────────▶ rendered HTML with data
  └─ server actions: publish = POST /mandates + /revoke        components/policies/*
        (same client, same mockFetch)                          ├─ table sorting, filters
                                                               └─ draft editor + simulation:
                                                                  engine/ replays the 30 days
                                                                  sent with the page
app/system     ── every used component, on fixtures
app/dev-stats  ── server/github, server/vinaya (server-only) ─▶ snapshot first, then polls
               build: write snapshot → next build → leak check
```

Every Saifuro read and write is the real call, typed by the schema; `mockFetch` answers it and nothing leaves the server. Going live is replacing `mockFetch` with `fetch` in one file, a reviewed change; no environment variable switches it.

**Key decisions** (each recorded in [`docs/adr/`](docs/adr/)):
1. **No live Saifuro calls; sample data, labelled**.
2. **Types are generated from a vendored OpenAPI snapshot** (`spec/saifuro-openapi.yaml` → `src/saifuro/schema.d.ts`).
3. **A policy is a console layer, saved as one mandate per assignment**.
4. **A pure engine sits between data and UI**, for evaluation and simulation.
5. **Next.js, Tailwind v4 and shadcn/ui on Base UI**.
6. **The look follows Saifuro's console in shadcn's variables, with an honesty badge**.
7. **The development record is read on the server**.
8. **The development log paints a build-time snapshot first**.
9. **Saifuro calls go through one typed client, answered by a mock transport**; pages render on the server.

## 5. Data mapping (Saifuro → view models)

Every Saifuro shape comes from `src/saifuro/types.ts`. Facts about Saifuro are in `.claude/rules/saifuro-contract.md`, with the docs page each comes from; how the engine applies them, with examples, is in `.claude/rules/policy-engine.md`.

| View model | Source | Rule |
|---|---|---|
| Policy terms | `MandateTerms` (`Omit<MandateCreate, "agent">`) | `principal`, `limits` (`per_transaction`, `per_month`, `currency`), `categories`, `review_above`, `expires`. `escrow.required_above` is stored but changes no outcome. |
| Assignment's mandate | `Mandate` | One per assigned agent: the policy's terms plus `agent`. Status `active`, `revoked` or `expired`. |
| Custom mandate | `Mandate` not created from a policy | Shown read-only. |
| Decision row | `Decision` | `request` (agent, amount, currency, recipient, category), `verdict`, `reason`, `mandate`, `issued_at`. Outcome word from the verdict: `allow` → paid, `review` → waited for you, `deny_*` → blocked. |
| Version | ours | Never `Decision.policy_version`, which labels the organization's policy set and does not change when mandates do. |
| Publish plan | engine | The revokes of the current version's mandates and one `MandateCreate` body per assignment, in that order. |

**Evaluation order** (Saifuro's, per mandate): applicable mandate in the request's currency → not revoked → not expired → category → per-payment limit → rolling 30-day limit (allows under this mandate) → velocity (10 decisions in 60 s, per agent) → review threshold → allow. **Several mandates:** creation order; first `allow`, else first `review`, else the oldest mandate's result.

**Simulation:** replays the last 30 days of sample decisions in time order against the draft, one mandate per assigned agent, carrying the draft's own 30-day totals forward.

## 6. Sample data

- **Agents:** a handful of sample agents in Saifuro's id shape (`agt_research_bot`, `agt_buyer_bot`, `agt_crawl_bot`), plus one new agent with no mandate. Named as sample data on every page.
- **Policies:** two or three, each with a short history of versions by sample people ("Maya Chen, controller"; "You"), at least one assigned to several agents, and one agent holding a custom mandate.
- **Decisions:** about 400 over the last 30 days across the agents, in Saifuro's `Decision` shape, generated from a fixed seed against a fixed `now`, so every load and every test sees the same numbers. They include every verdict code the policies can produce, a burst that trips velocity, and reviews.
- Recipients look like Saifuro's (`vendor:acme_saas`); categories are short slugs (`data`, `saas`, `compute`). Currency is `USDC`.

Never present sample data as real, and never invent a Saifuro behaviour to make the data more interesting.

## 7. Quality bar (definition of done for the whole build)

- The full flow (assistant → form → simulation → review → publish → history → compare → roll back) works on the deployed URL.
- `/system` shows every component the app uses, in every state, in both themes; nothing on it the app doesn't use.
- `/dev-stats` paints the snapshot on a cold visit and goes live; no token in the snapshot or the client build.
- Format, lint, types, tests and build are green; the engine's tests cover every example in the `policy-engine` rule.
- No console errors. No Saifuro host or key in the source or the build; no development-record token in the client build (`ship-check`).
- Keyboard-only use works, reduced motion is honoured, both themes are readable, and every screen works at 390px wide.
- Deployed to a public URL, working on a phone browser.

## 8. Tasks

The tasks live on the forge, not in this spec: the task Issues on this project's milestone. Each Issue carries its own objectives, surface, dependencies and test plan, and the forge holds its state.

This spec states what the product is and what it must do. It never lists tasks, their numbers, their order or their dependencies: those are plan, and they change every time the plan changes.

**Shared for every task:**
- Follow AGENTS.md and the path rules for the surface.
- Use CONTEXT.md's terms.
- Finish with the `ship-check` skill.
- A task that adds a dependency (including a shadcn component's) must say why in its PR and pin it exactly, because it touches the lockfile, which is a shared blast-radius domain.

## 9. Post-install setup (after Vinaya is installed)

1. **Check the agent config survived install.** `AGENTS.md`, `CLAUDE.md`, `.claude/rules/`, `.claude/skills/` and `.agents/skills/` must sit next to Vinaya's generated files. In Claude Code, `/context` should list `CLAUDE.md` under memory files.
2. **Biome keeps ignoring Vinaya's files.** `.mcp.json` and `vinaya.config.json` are already excluded in `biome.json`.
3. **Doc-coverage bindings** in `.vinaya/doc-owners` (Vinaya-managed; append below its header). Bind only contract files, so ordinary PRs don't owe a doc edit:
   ```
   src/saifuro/types.ts          .claude/rules/saifuro-contract.md
   spec/saifuro-openapi.yaml     .claude/rules/saifuro-contract.md
   src/styles/app.css            design/DESIGN.md
   biome.json                    AGENTS.md
   .github/workflows/checks.yml  AGENTS.md
   ```
4. **One registered project**, `policy-lab` (path `.`), so every task Issue declares `**Project:** policy-lab`.
5. **The development record's tokens**, for local dev and for agents: `VINAYA_LOG_READ_TOKEN` and `GITHUB_TOKEN` in `.env.local`, entered by the human and never committed. Agents in fresh worktrees get them exported in the launching shell only when a task needs `/dev-stats` live. CI needs neither: tests use fixtures.

## 10. Decisions

Settled, so the Planner doesn't stop to ask:
- **No Saifuro connection:** no calls, no keys, sample data labelled.
- **Saifuro access:** one typed client (`openapi-fetch` 0.17.0) with `mockFetch` as its transport; pages are server-rendered; publishes are server actions; each visitor's publishes persist in an httpOnly cookie, last 10, with "Reset demo".
- **Stack:** Next.js App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui Base UI flavour, TanStack Query, openapi-typescript, Vitest, Biome, bun; Vercel later.
- **Tokens:** shadcn's standard variables plus success and warning, set to Saifuro's palette; nothing else.
- **Components:** added from shadcn's Base UI flavour only when a screen needs one, and shown on `/system` from the same PR.
- **The table:** shadcn's Data Table — TanStack Table (`@tanstack/react-table` 8.21.3, pinned; the v8 API shadcn's guide uses) with shadcn's `Table`, as in shadcn's tasks example — one shared component for every table in the app.
- **Policies are assigned to agents**, one mandate per assignment; versions are per policy.
- **`/dev-stats` is in scope**, ported from Onchain Rewind, snapshot included.
- **Outcome words:** paid / waited for you / blocked.
- **Currency in the sample data:** USDC.

Open, research (record the answers in the `policy-engine` rule; the engine ships the interpretation below until then):
1. Is an amount **equal** to `per_transaction`, `review_above` or the `per_month` remainder inside the limit? The docs say "exceeds", "above" and "stays within". **Interpretation:** equal is inside.
2. Does a mandate still match **on** its `expires` date? The docs say "after it, `deny_expired`". **Interpretation:** yes, expired from the next UTC day.
3. Does a `deny_velocity` decision count toward the next 60 seconds' ten? The docs say "10 decisions in the last 60 seconds". **Interpretation:** yes, every decision counts.

Open, for the Principal:
- **The assistant's model and key.** Structured output needs a model call on the server; which provider, and the server-only key it reads (never `NEXT_PUBLIC_`), are undecided. Until then the assistant can't be built live; the form works by hand.
- **Theme switching.** The tokens define light and `.dark`; whether the app offers a toggle or follows the operating system is undecided. Until then it renders light.

**Principal actions, not decisions** (tasks stop and ask when they reach these):
- Create the GitHub repository and install Vinaya (§9).
- Create and link a Vercel project, before the deploy.
- Tick each PR's Test Plan after checking it in the browser.
- Before the first agent build (AGENTS.md rule 11), confirm these Vercel project settings. They are the Principal's, and nothing here has been verified by an agent:
  - **Deployment Protection is on**, so an unaliased production-target build's URL is not open to the public.
  - **"Auto-assign custom production domains" is off**, so `vercel deploy --prod --skip-domain` does not take the production domain.
- Make `VINAYA_LOG_READ_TOKEN` and `GITHUB_TOKEN` available to the deploy (Vercel environment variables), both read-only and server-only, before `/dev-stats` ships.
