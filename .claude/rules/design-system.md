---
paths:
  - "src/components/**"
  - "src/styles/**"
---

# Design system

The look is plain **shadcn/ui, Base UI flavour**, on Saifuro's console palette. `design/DESIGN.md` links the design system and records the token values; `src/styles/app.css` is where they live.

## Components (`src/components/ui/`)
- **Components come from shadcn's Base UI flavour.** Add one with `bunx shadcn@4.23.0 add <name>` (style `base-nova` in `components.json`), then `bun run fix`, then pin exactly any dependency the CLI added to `package.json`.
- **Only add a component when a screen needs it.** No speculative installs, no "might be useful" components. The bootstrap installed none.
- shadcn's files are owned code once added: adapt them to the tokens if needed, keep their prop surface (`...props`), and never re-add over local changes without reading the diff.
- **Nothing outside `src/components/ui/` imports `@base-ui/react`** (a Biome `noRestrictedImports` rule, error). Feature components in `src/components/policies/` import from `@/components/ui/*`.
- Compose with Base UI's `render` prop (`render={<a href=… />}`), never `asChild`.
- **One data table: shadcn's Data Table.** Every table (policies, assigned agents, simulation changes, history) is one shared `DataTable` built the way shadcn's tasks example builds it: `@tanstack/react-table` (8.21.3, pinned; v8's `useReactTable` API, which shadcn's guide uses) driving shadcn's `Table` component, with column definitions per screen. No second table component, no other table library.
- **`/system`** lists every component the app uses and only those, each in its states, on fixtures, in both themes. A component is added there in the PR that first uses it; check its section in the browser whenever you change it.

## Tokens (`src/styles/app.css`)
- The whole set is shadcn's standard variables (`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1` … `--chart-5`, `--radius`) plus `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, in `:root` (light) and `.dark`.
- **Tokens only, no extra colours.** Use the generated utilities (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary text-primary-foreground`, `ring-ring`, `bg-success`, `text-warning`, `text-destructive`, `rounded-lg` = `--radius`). No raw hex, no arbitrary values (`bg-[#…]`, `text-[13px]`, `rounded-[5px]`), no new CSS variables, no opacity tricks to invent a shade a variable doesn't hold beyond what shadcn's own components already use.
- Sizes and type come from Tailwind's default scale (`text-xs` … `text-2xl`, spacing in 4px steps).
- A value the set can't express is a question for the Principal (SPEC.md §10), never a new token.

## Outcomes
- **paid** = `success`, **waited for you** = `warning`, **blocked** = `destructive`. The word always shows next to the colour; colour never carries an outcome alone.
- Verdict codes (`deny_limit` …) appear in mono (`font-mono`) in trace lines and the JSON view only.

## Typography
- Geist (`font-sans`) for all UI, JetBrains Mono (`font-mono`) for ids, amounts, timestamps, trace lines and JSON. Numbers use `tabular-nums`.
- Sentence case everywhere. Buttons name the outcome ("Publish version 4", "Test against last 30 days"). Say what happens above each limit ("Up to 50 USDC per payment · above is blocked").
- Limits apply per agent: say so wherever limits appear.

## Responsive
- **Every screen works at 390px wide** with no horizontal page scroll. Tables scroll inside their own container; dialogs fit the viewport; touch targets stay at least 40px tall.
- Check 390, 768 and 1440 widths in `verify-ui`.

## Accessibility checklist (every PR touching components)
- Icon-only controls have `aria-label` (and a Tooltip).
- Focus is visible on keyboard focus only (shadcn's `focus-visible:ring-ring/50` pattern).
- Dialogs trap focus and return it on close.
- The simulation's headline is in a polite live region, so a change while editing is announced once.
- Text contrast AA in both themes; `muted-foreground` is the lowest colour readable text uses.
- `prefers-reduced-motion`: transitions become instant (`motion-reduce:`).
