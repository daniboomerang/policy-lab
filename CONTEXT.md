# Policy Lab

The Policies tab of an agent-spend console, built against Saifuro's public API reference and run on sample data. This document fixes the language used across the codebase, the specs and the PRs. Use these terms exactly, and avoid the listed alternatives.

## Language

### What spends, and under what authority

**Agent**: An identity that can ask to spend (Saifuro's `Agent`, id `agt_…`). Developers create agents; Policy Lab never does. An agent with no mandate cannot spend: every request it makes is `deny_no_mandate`. _Avoid_: Bot (as a domain term), user, account, wallet

**Mandate**: Saifuro's real, per-agent permission to spend (`Mandate`, id `mnd_…`): one agent, a principal, limits (`per_transaction`, optional `per_month`, `currency`), allowed `categories`, optional `review_above`, and an `expires` date. Immutable: there is no update endpoint, so a change is a revoke plus a create. An agent can hold several. _Avoid_: Rule, permission, limit set, allowance, policy (a policy is ours, a mandate is Saifuro's)

**Policy**: Policy Lab's own layer over mandates, which the API does not have: a reusable, named set of mandate terms (a mandate body without its agent) with a version, the agents it is assigned to, and console-only extras (approved vendors, Slack notify). _Avoid_: Rule, rule set, template, profile, mandate (when the console-level object is meant)

**Assignment**: One agent a policy applies to. Each assignment is saved as exactly one mandate for that agent, so a policy assigned to N agents is N mandates, and each agent gets its own limits: there is no shared budget. _Avoid_: Binding, attachment, membership, link

**Custom mandate**: A mandate made over the API directly, not from a policy. Shown beside policy mandates on an agent's row, marked as custom, and never edited by the console. _Avoid_: Manual mandate, orphan, unmanaged rule, legacy mandate

**Principal**: The mandate field naming who grants the authority (`role:procurement_lead`, `user:jkim`). Saifuro records it as who should approve a review, but any organization key can approve. In governance prose (AGENTS.md, SPEC.md §9–§10) "the Principal", capitalised, is this repo's owner, a different thing; product code and UI never use the word that way. _Avoid_: Owner, approver, granter, admin

### Versions and changes

**Version**: The number of a published policy (version 1, 2, 3…). Publishing a new version revokes the policy's current mandates and creates new ones, one per assignment. Never Saifuro's `policy_version` field, which labels the organization's policy set and does not change when mandates do. _Avoid_: Revision, release, policy_version (for ours), edit

**Draft**: Unpublished changes to a policy: what the assistant and the form produce, what the simulation replays, and what publishing turns into the next version. Not live, and saved nowhere in Saifuro. _Avoid_: Proposal, pending policy, staged change, edit

**Publish**: Turning a draft into the next version: revoke the current version's mandates, create the new ones. Consequences the UI states in words before it happens: `per_month` totals restart from zero under the new mandates, and reviews waiting under the old mandates can no longer be approved. _Avoid_: Save, deploy, apply, activate, push

**Approved vendors**: A console-only list of recipients a policy expects its agents to pay. Saifuro does not check recipients, so the UI tags it "Not enforced by the API yet" wherever it appears. _Avoid_: Allowlist (unqualified), whitelist, payee rule, recipient limit

### Decisions and outcomes

**Decision**: One spend request evaluated against an agent's mandates (Saifuro's `Decision`, id `dec_…`), with its verdict, reason and the mandate it was evaluated against. _Avoid_: Transaction, payment (for the decision itself), event, authorization (for the result)

**Verdict code**: The decision's machine code, exactly as Saifuro returns it: `allow`, `review`, `deny_limit`, `deny_velocity`, `deny_category`, `deny_expired`, `deny_revoked`, `deny_no_mandate`. Used in code, the JSON view and trace lines; never invented, renamed or extended. _Avoid_: Status, result code, error code

**Outcome**: The verdict as the UI says it to a controller. Three words only: **paid** (`allow`), **waited for you** (`review`), **blocked** (every `deny_*`). Each is drawn in its token (`success`, `warning`, `destructive`), and the word always shows. _Avoid_: Allowed, held, refused, approved, declined, rejected, success, failure (in the UI; "held" and "refused" appear only when a trace line quotes the engine)

**Per-payment limit** (`per_transaction`) and **30-day limit** (`per_month`): The two amount limits, in the mandate's currency. The 30-day limit is rolling: the allows under that mandate in the last 30 days plus the request. _Avoid_: Budget, monthly budget, monthly cap, calendar month, spend limit (unqualified)

**Review threshold** (`review_above`): Above this amount the verdict is `review` and the payment waits for a person. _Avoid_: Approval limit, soft limit, escalation

**Velocity rule**: Saifuro's fixed frequency rule: an agent that already had 10 decisions in the last 60 seconds gets `deny_velocity`. Not a mandate field and not configurable. _Avoid_: Rate limit (that is the API's transport 429), throttle, speed limit

### The console

**Engine**: The pure layer in `src/engine/` that evaluates a request against mandates in Saifuro's documented order, resolves several mandates, replays the simulation, and builds the view models components read. No I/O. _Avoid_: Service, rules engine (unqualified), evaluator class, backend

**Simulation**: Replaying the last 30 days of sample decisions, in time order, against a draft with the engine, and comparing each new outcome with the original. Sequential, because 30-day totals depend on what the draft would have allowed earlier. _Avoid_: Backtest, dry run, preview, what-if, test (as the noun)

**Trace line**: One line of a simulation or decision explaining which gate decided, in the order the engine checked: was, now, and the gate. _Avoid_: Log line, debug output, explanation

**Assistant**: The drafting helper that turns plain words into a filled-in draft through structured output. It only fills the form; the form is the truth, and a person reviews before anything is simulated or published. _Avoid_: AI, copilot, chatbot, agent (that word is Saifuro's)

**Sample data**: Every agent, mandate, policy and decision in this app: deterministic, made up, labelled on every page. _Avoid_: Mock data (in the UI), demo data, fake data, live data, real data

**Honesty badge**: The fixed chrome label "Demo · sample data · not connected to Saifuro". _Avoid_: Disclaimer, banner, watermark

### The build itself

**Development record**: How this app was built, shown on the site: each task's round-by-round record and the guardrail totals, read on the server from GitHub and the Vinaya log. _Avoid_: Changelog, activity log, audit trail

**Development log**: The `/dev-stats` page that shows the development record. _Avoid_: Dashboard, admin panel, build log

**Development snapshot**: The development record as the last deploy's build read it, painted first on a cold visit to the development log until the live record replaces it. Generated by the build, never committed. _Avoid_: Cache, static record

**Component playground**: The `/system` page: every component the app uses, in each of its states, on fixtures. _Avoid_: Storybook, style guide, kitchen sink, demo page

## Decisions

Recorded in [`docs/adr/`](docs/adr/), one file per decision:

- No live Saifuro calls; sample data, labelled
- Saifuro types are generated from a vendored OpenAPI snapshot
- A policy is a console layer, saved as one mandate per assignment
- A pure engine sits between data and UI
- Next.js, Tailwind v4 and shadcn/ui on Base UI
- The visual language follows Saifuro's console, with an honesty badge
- The development record is read on the server
- The development log paints a build-time snapshot first
- Saifuro calls go through one typed client, answered by a mock transport
