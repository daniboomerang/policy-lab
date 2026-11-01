---
paths:
  - "src/engine/**"
---

# Policy engine

## Role
The engine is the only place that knows both Saifuro's shapes and the UI's view models (ADR-0004). It evaluates a request against an agent's mandates in Saifuro's documented order, resolves several mandates, replays the 30-day simulation against a draft, and builds what components render. Facts about Saifuro come from the `saifuro-contract` rule; this rule fixes how the engine applies them.

## Rules
- **Pure.** No `fetch`, no React, no globals, no `Date.now()`: pass `now` in so tests are deterministic.
- **Types from `src/saifuro/types.ts`** only. View models are the engine's own types, named in CONTEXT.md's words.
- **Never invent behaviour.** Each gate cites its docs page. An **interpretation** (the docs are silent) is marked as one below, pinned by a test, and listed in SPEC.md §10.
- **Honest data.** If a value can't be computed, leave it `undefined`; never fill a placeholder.

## Evaluation order for one mandate (`/concepts/decision-codes`, `/api/mandates`)
1. The mandate applies: same agent, `limits.currency === request.currency` (exact, case-sensitive). None apply → `deny_no_mandate`.
2. Not revoked → else `deny_revoked`.
3. Not expired (`now` is not after `expires`) → else `deny_expired`.
4. `request.category` is in `categories` → else `deny_category`.
5. `amount` within `per_transaction` → else `deny_limit` ("amount A exceeds per_transaction limit L").
6. If `per_month` is set: `amount` + the sum of **allows under this mandate** in the 30 days before `now` stays within `per_month` → else `deny_limit`.
7. The agent had fewer than 10 decisions in the 60 seconds before `now` → else `deny_velocity`. Counted per agent, across all its mandates, every verdict.
8. `amount` above `review_above` → `review`.
9. Otherwise `allow`.

## Several mandates (`/api/mandates`, `/guides/sandbox`)
- Evaluate every applicable mandate in **creation order**. The result is the **first `allow`**, otherwise the **first `review`**, otherwise **the oldest mandate's result**; the decision names the mandate it came from.
- "The engine weighs every mandate an agent has ever held": revoked and expired mandates still apply (and fail at gate 2 or 3).

## Interpretations (pinned by tests; listed in SPEC.md §10)
- "Exceeds" and "above" are strict: an amount **equal** to `per_transaction` is inside it; equal to `review_above` is `allow`; a 30-day total equal to `per_month` is inside it.
- `expires` is a date: the mandate still matches on that date (UTC) and is expired from the next day.
- Velocity counts every decision, including `deny_velocity` ones, in the window `(now − 60s, now]`.
- A `review` does not count toward `per_month` until it is approved; its approval is an `allow` decision at the approval time.

## Examples (these define the rules; tests must cover them)

Mandate `M` (`/concepts/core-concepts`, created 2026-08-01): `{ agent: "agt_procurement_01", limits: { per_transaction: 500, per_month: 5000, currency: "USD" }, categories: ["saas"], review_above: 250, expires: "2026-11-18" }`.

**1. Inside the limits** (`/guides/first-authorization`)
```
request: 120 USD, saas, now 2026-09-03T08:43Z     → allow under M
```

**2. Over the per-payment limit** (`/concepts/decision-codes`)
```
request: 720 USD, saas                             → deny_limit, reason "amount 720.00 exceeds per_transaction limit 500.00"
```

**3. Above the review threshold** (`/guides/first-authorization`)
```
request: 340 USD, saas                             → review
```

**4. Category outside the mandate** (`/guides/first-authorization`)
```
request: 120 USD, travel                           → deny_category
```

**5. The rolling 30-day limit counts allows only**
```
history under M in the last 30 days: allows 4,800 USD, one review of 300 USD (pending)
request: 150 USD, saas → allow   (4,800 + 150 ≤ 5,000)
request: 250 USD, saas → deny_limit   (4,800 + 250 > 5,000)
```

**6. Velocity is the eleventh decision in 60 seconds** (`/reference/not-built-yet`)
```
agent had 10 decisions in the last 60 s; request: 50 USD, saas  → deny_velocity
the same request with 9 prior decisions                        → allow
a 720 USD request with 10 prior decisions                       → deny_limit (gate 5 decides before gate 7)
```

**7. No mandate, or none in the request's currency** (`/concepts/decision-codes`)
```
fresh agent, no mandates                → deny_no_mandate, no mandate named
agent holds only M (USD); request 50 USDC → deny_no_mandate
```

**8. Several mandates: first allow wins, else the oldest's result** (`/api/mandates`)
```
A (oldest): categories ["saas"], per_transaction 500   B (newer): categories ["data"], per_transaction 100
request 50 USD data  → A: deny_category, B: allow       → allow under B
request 300 USD data → A: deny_category, B: deny_limit  → deny_category under A
```

**9. After a republish the oldest result is `deny_revoked`** (`/guides/sandbox`)
```
version 1's mandate V1 revoked at 10:00; version 2's mandate V2 created at 10:00 (per_transaction 100)
request 50 at 10:05  → V1: deny_revoked, V2: allow      → allow under V2
request 300 at 10:05 → V1: deny_revoked, V2: deny_limit → deny_revoked under V1
```

## Simulation
- Input: the draft's terms, its assignments, the sample decisions of the last 30 days, `now`. Output: per decision, the original outcome, the new outcome, the gate that decided, and the groups of changes (paid → waited for you, paid → blocked, waited for you → paid, blocked → paid, …) with counts, plus waited-for-you per week before and after.
- **Sequential, in time order**: the 30-day total under the draft depends on what the draft itself would have allowed earlier in the replay. Never evaluate decisions independently.
- Each assigned agent is evaluated against its own mandate built from the draft: limits are per agent, never shared.
- A request the original data shows as `deny_velocity` stays a decision in the velocity count whatever the draft does.

## Tests (Vitest)
- Co-locate as `*.test.ts`. Every example above is a test. Assert on each field, no whole-object snapshots.
- **Working method:** test-first. If an output looks wrong, add an input/output example here before changing code.
