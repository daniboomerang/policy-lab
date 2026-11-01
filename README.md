<div align="center">

# Policy Lab

**Spending policies for AI agents, drafted, tested and published.**

The Policies tab of an agent-spend console, built against [Saifuro](https://docs.saifuro.com)'s public API reference. Demo on sample data: not connected to Saifuro.

![status](https://img.shields.io/badge/status-in%20build-1355B4?style=for-the-badge)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Base_UI-000000?style=flat-square)
![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-2.5-60A5FA?style=flat-square&logo=biome&logoColor=white)

</div>

---

## The idea

An agent that can spend needs written authority. Saifuro writes it down as **mandates**: one per agent, never edited, only revoked and replaced. Policy Lab adds the layer a finance controller needs on top: a **policy**, a named set of mandate terms assigned to many agents, drafted in plain words, **replayed against the last 30 days** before it goes live, and published as a new version with a readable history.

- **Assistant first:** describe the policy; the assistant fills the form; the form is the truth.
- **Simulation:** see what would have been paid, waited for you or blocked.
- **Review and publish:** the consequences in words, then one mandate per agent.
- **History:** versions, diffs and roll back, never rewritten.
- **JSON view:** the exact mandate bodies, for the engineers.

## How it's built

- A **pure engine** (`src/engine/`) evaluates requests in Saifuro's documented order and runs the simulation, test-first from the docs' own examples.
- Saifuro's **types are generated** from a vendored OpenAPI snapshot (`spec/`), never hand-written.
- **No Saifuro calls and no keys:** everything is sample data, labelled on every page.

See [SPEC.md](SPEC.md), [AGENTS.md](AGENTS.md), [CONTEXT.md](CONTEXT.md) and [docs/adr](docs/adr/).

## Run it

```bash
bun install
bun dev                      # http://localhost:3000
```

| Script | |
|---|---|
| `bun run check` | format + lint + types, the same as CI |
| `bun run fix` | auto-format and organise imports |
| `bun run test` | unit tests (Vitest) |
| `bun run build` | production build |
| `bun run gen:types` | regenerate Saifuro types from `spec/saifuro-openapi.yaml` |

---

<div align="center">

Built by **[Dani Estevez](https://github.com/daniboomerang)** · governed by **[Vinaya](https://vinaya.attalabs.dev)** from **AttaLabs**

<sub>Built from Saifuro's public API docs. Not affiliated with or connected to Saifuro.</sub>

</div>
