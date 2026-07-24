# RFC 0002: Composable primitives + style registry

- **Status:** Accepted
- **Author(s):** Andrew Keohane
- **Created:** 2026-07
- **Affects:** all components; adds `Button`, `IconButton`, `Input`, `Icon`, `Pagination`,
  generic `Table<T>`; `theme/componentStyles.ts`; `hooks/useControllableState`

## Summary

Refactor the bespoke filter components onto a small set of reusable primitives, make the
filters controllable-or-uncontrolled, make the table and pagination generic, and move every
component into its own folder with a colocated `.styles.ts` rolled up into a central registry.

## Motivation

The filters worked but were one-offs: `FilterPill` was a hand-rolled button, `SearchInput` a
hand-rolled field, `TrackTable` hardcoded the songs columns and its own pagination, and styles
were scattered. That's not a system — it doesn't extend. A design system needs primitives that
compose, a consistent extension surface, and one place to see and change styling.

## Proposal

- **Primitives.** `Button` (`solid`/`outline`/`ghost`/`pill` variants; the filter trigger is
  the `pill`), `IconButton` (mandatory label), `Input` (adornment slots; `SearchInput` composes
  it), `Icon` (t-shirt sizes `xs…xl` + numeric escape hatch). Each forwards `ref`, spreads
  `...rest`, and takes an `xstyle` StyleX escape hatch.
- **Controllable state.** `useControllableState({value, defaultValue, onChange})` gives every
  stateful component the controlled-or-uncontrolled contract; applied to both filters and `Input`.
- **Generic data components.** `Table<T>` takes `Column<T>[]` (header/cell/sortable/width); the
  page passes `Column<Track>[]`. `Pagination` is standalone with `prevButtonProps`/`nextButtonProps`
  slot spreading.
- **Style registry.** Each component's `<Name>.styles.ts` is rolled up in
  `theme/componentStyles.ts` into one `styles` object components reference as `styles.<name>.<slot>`.
- **Prop-spreading convention** — root spread + ref, named slot-props, and `xstyle` — documented
  in `CONTRIBUTING.md`.

## Alternatives considered

- **Leave the filters bespoke.** Rejected: doesn't demonstrate a system or extend to new filters.
- **Astryx `defineTheme` for the style rollup.** Rejected as heaviest; couples components to
  Astryx's theming internals. The plain registry is transparent and framework-agnostic.
- **A single `Filter` component with a `mode` prop** instead of primitives. Rejected — see RFC 0001.

## Migration & compatibility

Public component APIs are source-compatible (filters gain optional `defaultValue`; `value`
becomes optional). Internal imports move to the new folders and barrels. Rendered output is
pixel-identical — verified by the unchanged visual-regression baselines.

## Accessibility

No regressions: role/label/keyboard behaviour preserved (axe suite green). The multi-select's
option row gains a `:focus-within` ring, improving keyboard-focus visibility.

## Open questions

- Extend `useControllableState` to `Table` sort and `Pagination` page? Deferred — they're
  controlled today and the hook drops in trivially when a consumer needs uncontrolled.
