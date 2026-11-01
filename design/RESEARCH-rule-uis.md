# How the best products design spending-rule screens

Research, 31 Oct 2026. Every link was opened; the UI descriptions come from each product's own docs.

## The examples that matter most

| Product | What it does well | Link |
|---|---|---|
| **Stripe Radar** | Plain English to a drafted rule (Radar Assistant). "Test rule" against the last 6 months before saving. Shadow mode. A "Rule activity" log of who changed what, with before/after, for 180 days. **This is our concept, already at Stripe.** | https://docs.stripe.com/radar/rules |
| **Brex spend limits** | Fields asked as plain questions: "Who can spend?", "How much can users spend?", "How often should this limit reset?", "Restrict merchants or categories". "View history" per limit. | https://www.brex.com/support/manage-budgets-and-spend-limits |
| **Ramp spend programs** | A wizard that ends on a **Review** step. "Duplicate program" works as a template. Approval flows by amount and role, and the requester can't approve their own spend. | https://support.ramp.com/spend-programs-creation-and-management · https://support.ramp.com/setting-up-spend-request-approvals |
| **Lithic auth rules** | New rules start as **drafts in shadow mode**, with version history and a performance comparison against the live version, plus a rule library. | https://docs.lithic.com/docs/authorization-rules-v2 |
| **Expensify** | The approval rule is one sentence: "If report total is over [$] → then approves to [person]". | https://help.expensify.com/articles/expensify-classic/reports/Require-review-for-over-limit-expenses |
| **Pleo** | Separates the per-purchase limit (hard decline) from the monthly limit (soft). | https://blog.pleo.io/en/spending-limits |
| **Stripe Issuing** | Limits per authorisation and per period. Categories are either allowed or blocked, never both. | https://docs.stripe.com/issuing/controls/spending-controls |
| **Safe spending limits** | A review screen, then Pending until co-signed, then Active. | https://help.safe.global/en/articles/40842-set-up-and-use-spending-limits |
| **AWS IAM** | A visual view with a JSON tab next to it, and "Review and create" shows a plain summary of the permissions. | https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html |

**Anti-pattern:** crypto and agent wallets (Coinbase CDP, Privy, Turnkey) offer **JSON only**, which is wrong for a finance controller. That's the gap Saifuro's console fills.

## Patterns to copy, and where each goes in the mandate screen

1. **Ask in questions** (Brex): one plain question per field.
2. **Restate in words on a review step** (Ramp, AWS). This matters more when a rule can't be edited.
3. **Test against history before publishing** (Stripe Radar, Lithic): what the last 30 days would have looked like.
4. **Show the per-payment and 30-day limits together**, and say what happens at each: above per-payment is blocked, above the approval line waits for a person (Pleo, Stripe).
5. **One-sentence approval with a named person** (Expensify, Ramp). Whoever authorises the rule shouldn't be its only approver.
6. **Categories as an allow-list of chips** with one line of description each (Stripe, Brex).
7. **Draft, then live, with version history and before/after** (Lithic, Radar, Brex).
8. **Start from the current rule or a preset** (Ramp duplicate, Lithic library).
9. **Plain English drafts the fields; the fields are the truth** (Radar Assistant).
10. **"View as JSON" for the engineers** (AWS, Cloudflare). In Saifuro's case that's the real mandate object.

Avoid hidden rules and hidden defaults: always say what happens above each limit.

## Pitch line

"Stripe Radar lets a fraud team test a rule against six months of history before switching it on. I applied that to mandates: a controller describes the rule, sees what the last 30 days would have looked like, and publishes a new version, never an edit."
