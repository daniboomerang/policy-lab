---
name: verify-ui
description: Verify the Policy Lab UI in a real browser after any change to components, routes or styles — walks the policy flow, checks console, keyboard, widths down to 390px, both themes and reduced motion, and reports what it saw. Use before calling a UI task done.
argument-hint: "[route, default /]"
---

# Verify the UI in the browser

Steps for screens that don't exist yet are reported as "n/a", not as failures.

1. Start the dev server (`bun dev`) if it isn't running. Open the route given as the argument (default `/`).
2. **Chrome:** "Policy Lab" and the honesty badge "Demo · sample data · not connected to Saifuro" are visible on every route visited. No Saifuro logo or name anywhere else. No console errors.
3. **Policies table:** every policy shows its name, version, assigned agents and limits per agent; custom mandates appear, marked as custom; an agent with no mandate reads as unable to spend.
4. **Policy page:** assigned agents and the mandate each one holds; "Not enforced by the API yet" next to approved vendors.
5. **Assistant:** describe a policy in plain words; the form fills in; editing the form changes the draft; nothing is simulated or published until a person continues.
6. **Simulation:** the headline ("Last 30 days: N decisions. With this draft, M would change.") updates while editing and is announced once by a screen reader (live region). Each group opens its decisions with trace lines. Outcomes read paid / waited for you / blocked, each with its word.
7. **Review and publish:** the review states, in words, the version number, that the old mandates are revoked, that 30-day totals restart and that waiting payments under the old version can no longer be approved. Publishing adds a version to the history.
8. **History:** versions with who, when and note; comparing two shows the change in words; rolling back publishes a new version.
9. **JSON view:** shows the exact `POST /v1/mandates` bodies (one per assignment) and the revokes, labelled as not sent.
10. **Keyboard only:** every control reachable with Tab, visible focus ring, dialogs trap focus and return it on close, Escape closes them.
11. **Widths:** 390, 768 and 1440. At 390 there is no horizontal page scroll, tables scroll in their container, dialogs fit.
12. **Themes:** add the `dark` class to `<html>` in DevTools; every screen stays readable.
13. **Reduced motion:** emulate `prefers-reduced-motion: reduce`; nothing moves.
14. **`/system`**: every section renders with no console errors; each component the app uses is there, in its states, in both themes; nothing is there the app doesn't use.
15. **`/dev-stats`** (once it exists): a cold visit paints the snapshot with its "taken at" line, then goes live; no token appears in the page source or network responses.

Report each step as pass, fail or n/a, with one line of evidence for each failure: the exact console message, or what was seen versus what was expected. Don't fix anything while running this skill. Report first.
