---
"music-table": minor
---

Refactor onto composable primitives. Adds `Button` (the filter trigger is its `pill`
variant), `IconButton`, `Input` (with `SearchInput` composed from it), `Icon` (t-shirt sizes),
`Pagination`, and a generic `Table<T>`. Both filters are now controllable-or-uncontrolled via
`useControllableState`. Component styles are colocated in `<Name>.styles.ts` and rolled up into
a central registry (`theme/componentStyles.ts`). Rendered output is pixel-identical. See
`docs/rfcs/0002-composable-primitives.md`.
