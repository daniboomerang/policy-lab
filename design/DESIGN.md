# Policy Lab — DESIGN.md

The Policies tab of an agent-spend console, drawn in Saifuro's console palette with plain shadcn/ui (Base UI flavour). Desktop 1440×900, working down to 390 wide.

**Design system:** [Policy Lab Design System](https://claude.ai/artifact/R5vAW6YzzNwByYNkanHsRq) — the look, the screens (Policies home, assignment table, assistant, simulation, trace lines, history) and the component inventory. The app takes its layouts and copy from it, builds every component from shadcn's Base UI flavour, and uses only the tokens below; the design system's own CSS classes are not used in the app.

Files in this folder:
- `DESIGN.md` — this file, living: update it when a token value changes or a component is added.
- `marketing-literal-palette.txt` — colours, radii, shadows and sizes read off Saifuro's public pages (light). Read-only.
- `docs-theme-vars.txt` — the CSS variables of Saifuro's documentation theme (the dark set). Read-only.
- `RESEARCH-rule-uis.md` — how the best spend-rule screens work, and which pattern goes where. Read-only.

## 1. Tokens

shadcn's standard variables plus success and warning, in `src/styles/app.css`. This is the whole set (ADR-0006).

| Variable | Light | Dark | Use |
|---|---|---|---|
| `background` | #FFFFFF | #0B1421 | Page |
| `foreground` | #0F1E33 | #F3F5F8 | Text and values |
| `card` / `popover` | #FFFFFF | #122032 | Cards, tables, menus |
| `card-foreground` / `popover-foreground` | #0F1E33 | #F3F5F8 | |
| `primary` | #1355B4 | #46A0E2 | The one main button; links |
| `primary-foreground` | #FFFFFF | #0B1421 | Label on primary |
| `secondary` | #F1F5F9 | #1C293D | Secondary buttons, neutral pills (the honesty badge) |
| `secondary-foreground` | #0F1E33 | #F3F5F8 | |
| `muted` | #F1F5F9 | #1C293D | Sunken panels: expanded rows, code, trace lines |
| `muted-foreground` | #5C6F88 | #97A7B7 | Labels, metadata, help; the lowest readable text colour |
| `accent` | #F1F5F9 | #1C293D | Hover surface |
| `accent-foreground` | #0F1E33 | #F3F5F8 | |
| `destructive` | #B4231F | #F87171 | **blocked**, validation errors |
| `success` / `success-foreground` | #15803D / #FFFFFF | #4ADE80 / #0B1421 | **paid** |
| `warning` / `warning-foreground` | #B45309 / #FFFFFF | #FBBF24 / #0B1421 | **waited for you** |
| `border` | #DFE8F1 | #273445 | Card and table outlines, dividers |
| `input` | #D7E1EC | #273445 | Control borders |
| `ring` | #2E9BE0 | #46A0E2 | Focus ring |
| `chart-1` … `chart-5` | #1355B4, #2E9BE0, #15803D, #B45309, #B4231F | #46A0E2, #85BAEC, #4ADE80, #FBBF24, #F87171 | Charts |
| `radius` | 6px | 6px | `rounded-lg`; `rounded-sm` ≈ 4px for pills |

Values given by the owner: foreground, primary, primary-foreground, ring, border, radius, and the dark background, card, foreground, muted-foreground, border, primary and ring. The rest match the design system's final token table exactly; change a value there first, then here and in `app.css`.

**Type:** Geist (`font-sans`) for UI; JetBrains Mono (`font-mono`) for ids, amounts, timestamps, trace lines and JSON, with `tabular-nums` on every number. Tailwind's default scale.

**Theme:** light in `:root`, dark in `.dark` on `<html>` (shadcn's convention). How the class is set is an open decision (SPEC.md §10).

## 2. Components

None installed yet. Each task that needs a component adds it from shadcn's Base UI flavour, shows it on `/system` in its states, and lists it here. Every table is shadcn's Data Table (TanStack Table v8 + shadcn `Table`), one shared component.

| Component | Added for | Notes |
|---|---|---|

## 3. Honesty

"Demo · sample data · not connected to Saifuro" sits beside the product name on every page, as a `secondary` pill. Anything the API does not enforce says "Not enforced by the API yet".
