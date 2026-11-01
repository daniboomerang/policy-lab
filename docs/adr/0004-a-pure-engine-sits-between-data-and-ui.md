# A pure engine sits between data and UI

All logic that knows Saifuro's shapes lives in `src/engine/` as **pure functions**: evaluating a request against a set of mandates in Saifuro's documented gate order, resolving several mandates, replaying the 30-day simulation against a draft, and building the view models components render. No React, no fetch, no clock read without injection. Components read view models only.

## Considered options

- **Evaluate inside components or hooks.** Rejected: the evaluation order and the multi-mandate rule are the product's correctness claim, and logic spread through components can't be tested from the docs' examples without rendering UI.
- **A server API that evaluates and simulates.** Rejected: there is no live data to protect (ADR-0001), so a server hop adds latency to every keystroke of the draft and a deployable to maintain, for nothing.
- **A pure engine, test-first.** Chosen: every documented example (the 720 over a 500 limit, the 340 above a 250 review threshold, the eleventh request in 60 seconds) becomes a unit test, and the simulation reruns in the browser as the draft changes.

## Consequences

- The gate order is fixed in one function and tested: mandate exists → not revoked → not expired → category → per-payment limit → rolling 30-day limit → velocity → review threshold → allow. Several mandates in the request's currency are evaluated oldest first; the result is the first `allow`, else the first `review`, else the oldest mandate's result.
- The simulation is sequential, because a 30-day total depends on what the draft itself would have allowed earlier in the replay.
- Where the docs leave a boundary open (is an amount equal to a limit inside it?), the engine takes one reading, the `policy-engine` rule labels it an interpretation, and a test pins it.
- Components never import `src/saifuro/schema.d.ts`; a change to Saifuro's shapes is absorbed in the engine.
