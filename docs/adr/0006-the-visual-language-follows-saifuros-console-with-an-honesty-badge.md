# The visual language follows Saifuro's console, with an honesty badge

Policy Lab is drawn as **a tab of Saifuro's own console** would be. The token set is **shadcn's standard theme variables** (`--background` … `--chart-5`, `--radius`) plus `--success` and `--warning`, light and dark, set to Saifuro's palette: foreground `#0F1E33`, primary `#1355B4` on white, ring `#2E9BE0`, border `#DFE8F1`, radius 6px; dark from their docs theme (background `#0b1421`, card `#122032`, foreground `#f3f5f8`, muted foreground `#97a7b7`, border `#273445`, primary and ring `#46a0e2`). Type is Geist and JetBrains Mono. There is **no token beyond that set and no extra colour**. Saifuro's **name and logo never appear in the app chrome**; the only mention is the honesty badge "Demo · sample data · not connected to Saifuro".

## Considered options

- **A neutral, unbranded look (shadcn's default neutral palette).** Rejected: the point of the demo is to show the Policies tab as it would sit in Saifuro's console; a different visual language would make the reader translate.
- **Saifuro's full branding, logo and name included.** Rejected: it would present a demo built from public docs as Saifuro's own product, which it is not.
- **A custom token set beyond shadcn's** (outcome families, row and control sizes). Rejected: shadcn's variables plus success and warning cover the screens, and every extra token is one more thing for components to drift from.
- **Saifuro's palette in shadcn's variables, no name or logo, and a permanent honesty badge.** Chosen.

## Consequences

- `src/styles/app.css` is the whole token set; `design/marketing-literal-palette.txt` and `design/docs-theme-vars.txt` are the read-only sources behind its values.
- Outcomes use the set as it is: paid is `success`, waited for you is `warning`, blocked is `destructive`, and every outcome always shows its word, so no state depends on colour alone.
- The honesty badge is part of the chrome on every route and is not dismissible.
- The product name in the chrome is Policy Lab.
