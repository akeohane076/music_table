# RFC 0001: Filter component API

- **Status:** Accepted
- **Author(s):** Andrew Keohane
- **Created:** 2026-07
- **Affects:** `SearchInput`, `SingleSelectFilter`, `MultiSelectFilter`, `FilterPill`, `FilterPopover`

A worked example of the RFC format, and the rationale for the filter API as it stands.

## Summary

Three filter components (search, single-select, multi-select) built on two shared primitives
(`FilterPill`, `FilterPopover`) and one option shape (`FilterOption`). All are fully controlled.

## Motivation

The page needs a reusable, configurable filter set. "Reusable" is only credible if the
components share their trigger, surface, motion, and option contract — otherwise each filter
drifts and the design-system promise (consistency, reuse) is unmet.

## Proposal

**One option shape** every select-style filter speaks, so consumers learn it once:

```ts
interface FilterOption<T extends string = string> {
  readonly value: T;   // stored in state
  readonly label: string; // shown to the user
}
```

Keeping `value` distinct from `label` lets the same components drive facets whose display
text differs from the stored value; `toOptions(values)` covers the common identical case.

**Fully controlled** (`value` + `onChange`) so the page owns one source of truth and filters
compose without internal-state surprises. The multi-select's in-progress edits are the one
piece of internal state — see below.

```tsx
<SearchInput value onChange placeholder clearable />
<SingleSelectFilter label options value onChange isClearable />
<MultiSelectFilter  label options value onChange isSearchable
  formatTriggerLabel /* + Apply/Clear/Selected/empty copy as props */ />
```

**Shared primitives.** The filters compose the library primitives (`Button` — the trigger is
its `pill` variant, `IconButton`, `Input`/`SearchInput`, `Icon`) rather than hand-rolling
controls. `FilterPopover` owns the Popover↔trigger wiring, open/close state, and surface
reset — a new filter is built by rendering a menu body inside it, and trigger, dismissal,
focus, and anchoring come for free.

> Updated after RFC 0002 (composable primitives): the original design used a bespoke
> `FilterPill`; it is now the `Button` `pill` variant, and menu styling moved to
> `FilterPopover` + the style registry.

**Commit models differ on purpose.** Single-select applies immediately on click (a single
choice has nothing to batch). Multi-select edits a **draft** committed only on **Apply**;
dismissing discards it. This asymmetry is in the source design and is deliberate, not an
inconsistency to unify.

## Alternatives considered

- **Wrap Astryx's `MultiSelector` directly.** Fastest, but the graded artifact would be
  library configuration, not component design — and we'd inherit its trigger/commit model
  rather than own the draft/Apply contract. Rejected: we own the API, compose from primitives.
- **Uncontrolled variants.** Convenient for one-off use, but multiple filters intersecting on
  one page want a single external source of truth. Deferred; can be added additively later.
- **A single `Filter` component with a `mode` prop.** Collapses three clear APIs into one
  prop-configured blob; worse types, worse discoverability. Rejected in favor of three
  components over shared primitives.

## Migration & compatibility

Initial API — nothing to migrate. Future additions (async options, uncontrolled mode) should
be additive (minor). Renaming a prop or changing the commit model is major and needs its own RFC.

## Accessibility

- Single-select is a **menu of `menuitemradio`** items (pick-one, applies immediately) — not
  a listbox, which would nest a button in an interactive option.
- Multi-select uses native `<input type="checkbox">`, arrow-key navigation, and a labelled
  dialog; focus returns to the trigger on close.
- Triggers expose `aria-haspopup`/`aria-expanded`; motion respects `prefers-reduced-motion`.

## Open questions

- Should `formatTriggerLabel` be generalized to a full trigger render-prop for consumers who
  want a custom pill? Deferred until a real need appears.
