# A policy is a console layer, saved as one mandate per assignment

Saifuro's API has **no policy object**: "There is no `/v1/policies`", and the rules a request is evaluated against are the agent's mandates (Known gaps). A mandate belongs to exactly one agent and cannot be edited. Policy Lab adds a **policy**: a named, versioned, reusable set of mandate terms (`Omit<MandateCreate, "agent">`) assigned to agents, plus console-only extras (approved vendors, Slack notify). Each assignment is saved as **one mandate** for that agent. Publishing a new version revokes the current version's mandates and creates new ones.

## Considered options

- **Edit mandates directly, one agent at a time.** Rejected: a controller managing many agents with the same terms would repeat every change per agent, and nothing would say that five mandates are meant to be the same.
- **One shared mandate for several agents.** Rejected: the API doesn't allow it. `MandateCreate.agent` is a single agent, and limits apply per mandate, so there is no shared budget to model.
- **A console-level policy that writes one mandate per assignment.** Chosen: it matches how controllers think ("the research policy"), it keeps every mandate a real, valid `MandateCreate` body, and it makes versioning explicit where the API makes changes revoke-and-create anyway.

## Consequences

- Limits apply to **each agent separately**; the UI says so wherever limits appear.
- Publishing has documented side effects the UI states before it happens: the new mandates start with no allows, so `per_month` totals restart; reviews waiting under the revoked mandates can no longer be approved (Mandates, "Revoke"); and because Saifuro weighs every mandate an agent has held, a request no current mandate allows reports the oldest mandate's result, which after a republish is `deny_revoked` (Test in the sandbox).
- A policy's version is ours. It is never Saifuro's `policy_version`, which labels the organization's policy set and does not change when mandates do.
- Mandates made over the API directly are shown as **custom mandates**, read-only in the console.
- Approved vendors are never presented as enforced: Saifuro signs the recipient into the verdict but checks it against nothing.
