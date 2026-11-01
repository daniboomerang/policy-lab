# No live Saifuro calls; sample data, labelled

> Amended by [ADR-0009](0009-saifuro-calls-go-through-one-typed-client-answered-by-a-mock-transport.md): the calls are written as real calls through one typed client, and a mock transport answers them.

Policy Lab is built against Saifuro's **public API reference**, not against Saifuro. It makes no call to `api.saifuro.com`, holds no Saifuro key (`sk_*` or `ak_*`), and every agent, mandate, policy and decision it shows is deterministic sample data in Saifuro's documented shapes. Every page carries the honesty badge "Demo · sample data · not connected to Saifuro".

## Considered options

- **Call Saifuro's sandbox with a sandbox key.** Rejected: keys are issued at onboarding after an evaluation, with no self-serve signup (the docs' "Getting access" and "Documentation scope" pages), so there is no key to use; and a demo whose data depends on someone else's account can't be reviewed or reproduced.
- **A local mock server that answers the OpenAPI.** Rejected: a second process to run for no product gain. ADR-0009 keeps the typed client this would have needed, with the mock as an in-process transport instead of a server.
- **Sample data in Saifuro's shapes, labelled.** Chosen: the shapes come from the generated schema (ADR-0002), so the data is exactly as wide as the API; the engine reproduces the documented evaluation (ADR-0004); and the badge says what it is on every page.

## Consequences

- No secret exists for Saifuro, so none can leak; `ship-check` greps the source and the build for Saifuro key prefixes, and for `api.saifuro.com` anywhere but `src/saifuro/client.ts`, so a key or a second client added by mistake fails the check rather than depending on review.
- The sample data is deterministic (a fixed seed and a fixed `now`), so the simulation's numbers are the same on every load and in every test.
- Where the UI shows what would be sent to Saifuro (the JSON view, the publish step), it shows the exact request bodies and says they were not sent.
- Nothing in the app is a claim about Saifuro's live behaviour beyond what its docs state; the engine's interpretations of silent points are listed in SPEC.md §10.
