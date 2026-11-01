# Saifuro types are generated from a vendored OpenAPI snapshot

Every Saifuro shape in the code comes from **one reviewed copy** of Saifuro's OpenAPI description, committed at `spec/saifuro-openapi.yaml`. `bun run gen:types` runs openapi-typescript over it and writes `src/saifuro/schema.d.ts`, which is committed and never edited by hand. `src/saifuro/types.ts` names the shapes the app uses (`Mandate`, `MandateCreate`, `Decision`, `Verdict` and so on) as aliases of the generated ones.

## Considered options

- **Hand-written types from reading the docs.** Rejected: field names drift, optional fields get typed as required (or the reverse), and nothing tells a reviewer when a hand-typed field disagrees with the reference.
- **Generate at build time from the live `https://docs.saifuro.com/openapi.yaml`.** Rejected: the build would depend on the network and on a document that can change under us, so the same commit could typecheck one day and not the next, and agents would be fetching a third-party URL during tasks.
- **A vendored snapshot, generated and committed.** Chosen: the contract is a file in the repo, reviewed when it changes; the generated types are reproducible offline; and a diff of `schema.d.ts` shows exactly what a new snapshot changed.

## Consequences

- Updating the snapshot is its own PR: the new YAML, the regenerated `schema.d.ts`, and every rule or spec line the change affects.
- `ship-check` regenerates the types and fails if `schema.d.ts` differs from the committed file, so a hand edit or a stale generation is caught.
- Biome ignores `spec/` and `schema.d.ts`, so formatting never rewrites the generated output.
- The snapshot is the API as documented on the day it was taken (`info.version: 1.0.0`, OpenAPI 3.1.0). The docs prose stays the source for behaviour the schema can't express (evaluation order, immutability), cited in the `saifuro-contract` and `policy-engine` rules.
