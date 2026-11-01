@AGENTS.md

# Claude Code specifics

- **Never commit unless the user explicitly asks in that message.** Never add co-author trailers or any Claude attribution to commits, PRs or code. The code belongs to the repo owner.
- **Path rules load automatically** from `.claude/rules/` when you touch matching files. Workflow skills (`/verify-ui`, `/ship-check`) are invoked on demand.
- **Plan mode** (`/plan` or Shift+Tab) for multi-file tasks. Direct execution for single fixes. Use the Explore subagent for wide codebase searches, to keep the main context clean.
- **Saifuro's contract is the vendored snapshot.** Read `spec/saifuro-openapi.yaml` and the docs pages the `saifuro-contract` rule cites; never fetch the live API or docs during a task, and never call the API.
- **Personal notes** go in `CLAUDE.local.md`, which is gitignored and never committed.
