---
name: ship-check
description: Run the definition-of-done checks from SPEC.md §7 before opening a PR or deploying — format, lint, types, tests, build, generated types fresh, no Saifuro calls or keys, no leaked tokens, no raw Base UI, and a browser pass. Use at the end of every task.
allowed-tools: Bash, Read, Grep, Glob
---

# Ship check

Run these steps in order. Stop at the first failure and report it with the exact output line.

1. `bun run check:format`
2. `bun run check:lint`, then `bun run check:types`. These are the same three checks CI runs.
3. `bun run test` (Vitest; not bare `bun test`, which is Bun's own runner)
4. `bun run build`
5. **Generated types are fresh:** `bun run gen:types`, then `git diff --exit-code src/saifuro/schema.d.ts`. A diff means a hand edit or a stale generation.
6. **No Saifuro calls or keys:** `grep -rnE "\b(sk|ak)_(live|sandbox)_[A-Za-z0-9]" src .next/static` must find nothing, and `grep -rln "api\.saifuro\.com" src .next/static` must list only `src/saifuro/client.ts` (ADR-0001, ADR-0009). Docs strings that only name the prefix (`sk_live_`) in prose belong in `spec/` or `.claude/`, never in `src/`.
7. **Token leak check:** for `GITHUB_TOKEN` and `VINAYA_LOG_READ_TOKEN` (values read from `.env.local`, when set), the last 12 characters of the value must not appear anywhere under `.next/static`. Once `/dev-stats` lands, also check that neither the variable's name nor those characters appear in `src/server/github/dev-snapshot.json` when the build wrote one (ADR-0008), that `git ls-files` doesn't list it, and that `public/` holds no copy; `bun run build` ends with the same check, so read its `leak check:` lines. Print only "found" or "not found" per token, never a value. Also check `git ls-files` lists no `.env*` file except `.env.example`.
8. **No raw Base UI:** `grep -rn "@base-ui" src --include=*.tsx --include=*.ts` must only list files under `src/components/ui/`.
9. **Tokens only:** `grep -rnE "#[0-9a-fA-F]{3,8}\b|\[#|text-\[[0-9]" src --include=*.tsx` must find nothing (colours and sizes come from `src/styles/app.css` and Tailwind's scale).
10. **Pinned dependencies:** `grep -nE '"[~^]' package.json` must find nothing.
11. If the task touched UI, run the `verify-ui` skill.

End with a single line: `SHIP-CHECK: pass`, or `SHIP-CHECK: fail at step N`.
