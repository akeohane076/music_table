---
"music-table": minor
---

Composition with guardrails: every component now exposes typed `<part>Props` slots for its
internal elements (`labelProps`, `inputProps`, `rootProps`, `rowProps`, per-`Column`
`cellProps`/`headerProps`, `triggerProps`, etc.). Slots merge under a guardrail policy via
`mergeSlot` — the component's controlled values, identity, required ARIA, and StyleX classes
win, `className` concatenates, and consumer extras pass through — so consumers can extend the
markup without breaking correctness. See CONTRIBUTING "Prop spreading".
