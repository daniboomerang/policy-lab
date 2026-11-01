---
paths:
  - "src/saifuro/**"
  - "spec/**"
---

# Saifuro contract

Policy Lab never calls Saifuro (ADR-0001); its calls are written for real and answered by `mockFetch` (ADR-0009). This rule is what the code may assume about Saifuro, each fact with the docs page it comes from (`https://docs.saifuro.com` + the path). Agents don't fetch those pages during a task: the facts below and `spec/saifuro-openapi.yaml` are the contract. A fact not here and not in the snapshot is not a fact; stop and ask.

## Types
- `spec/saifuro-openapi.yaml` is the vendored snapshot (OpenAPI 3.1.0, `info.version: 1.0.0`). Read-only.
- `bun run gen:types` writes `src/saifuro/schema.d.ts` (openapi-typescript). Commit it, never edit it; `ship-check` regenerates and diffs it (ADR-0002).
- `src/saifuro/types.ts` names the shapes the app uses as aliases of `components["schemas"][…]`. Add an alias there when a new shape is needed; never retype a field.
- `MandateTerms = Omit<MandateCreate, "agent">` is a policy's terms (ADR-0003).
- `src/saifuro/client.ts` is the one client (`openapi-fetch`, `createClient<paths>`), the only file naming the base URL, and its `fetch` is `mockFetch` from `src/saifuro/mock/`. Both start with `import "server-only"`.
- `mockFetch` routes by method and path to one handler per call the console makes; each handler returns the schema's response type. Any other path returns Saifuro's 404 error shape. Publishes apply to the visitor's demo state (seed plus the visitor's publish operations, from an httpOnly cookie, last 10).

## Mandates (`/api/mandates`, `/concepts/core-concepts`)
- `MandateCreate`: `principal`, `agent`, `limits.per_transaction`, `limits.currency` and `categories` and `expires` are required; `limits.per_month`, `review_above` and `escrow.required_above` are optional.
- `per_transaction`: cap per spend, in major units of the currency. `per_month`: **rolling 30-day cap**: "the allows under this mandate in the last 30 days plus this request". `categories`: allowed list; anything else is `deny_category`. `review_above`: above this the verdict is `review`. `expires`: a date; after it, `deny_expired`.
- **Immutable.** "There is no update endpoint, deliberately." A change is revoke + create; decisions keep pointing at the mandate in force when they were made.
- **Revoke** (`POST /v1/mandates/{id}/revoke`): takes effect on the next request (`deny_revoked`), sets `status: "revoked"` and `revoked_at`; **"Pending reviews under it can no longer be approved."**
- An agent can hold several mandates; with none applicable the verdict is `deny_no_mandate`.
- **Recipients are not checked**: "A mandate limits amounts and categories, not recipients." Hence approved vendors are console-only and tagged "Not enforced by the API yet".
- **No unit conversion**: amounts are taken as sent, in the mandate's units. Currency is matched "exactly and case-sensitively" (`/api/authorizations`).
- `escrow.required_above` is stored but not read by the policy engine (`/reference/not-built-yet`): it changes no outcome.
- Statuses: `active`, `revoked`, `expired`. List filters: `agent`, `principal`, `status`.

## Decisions and reviews (`/api/authorizations`, `/concepts/decision-codes`)
- A denial is a `201` with a verdict, not an error.
- Eight verdict codes, exactly: `allow`, `review`, `deny_limit`, `deny_velocity`, `deny_category`, `deny_expired`, `deny_revoked`, `deny_no_mandate`.
- `Decision.mandate` is absent on `deny_no_mandate`. `reason` states the deciding rule in words, e.g. `amount 720.00 exceeds per_transaction limit 500.00`.
- `policy_version` labels the organization's policy set and **does not change when mandates do**. Never map it to a Policy Lab version (CONTEXT.md, Version).
- A review expires 24 hours after it is created. Approval issues a fresh `allow` decision with `supersedes`; before issuing it, it re-checks the agent is active, the mandate is neither revoked nor expired, and the amount plus every allow under the mandate in the last 30 days stays within `per_month`. Any organization key can approve; `waits_for` records the principal but is not checked.

## Agents (`/api/agents`)
- Agents are created by developers (out of scope). A disabled agent's mandates stop matching: `deny_no_mandate`.

## What the API does not have (`/reference/not-built-yet`)
- **No policies endpoint**: "There is no `/v1/policies`". Policies are ours (ADR-0003); never present one as a Saifuro object.
- **Reviews can be actioned but not read**: `GET /v1/reviews` and `GET /v1/reviews/{id}` return `404`. A pending review is visible only through the decision that created it and the `decision.review_pending` webhook.
- **The frequency rule is fixed**: more than 10 requests from one agent in 60 seconds is `deny_velocity`; not a mandate setting, not configurable.
- **No user management** and no public SDK.

## Webhooks (`/api/webhooks`)
- `mandate.revoked`, `mandate.expiring`, `decision.review_pending`, `decision.resolved` are the events a policy console would act on. Policy Lab shows them as sample history only; it registers nothing.
