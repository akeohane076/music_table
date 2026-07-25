# RFC 0003: Compound components

- **Status:** Accepted
- **Author(s):** Andrew Keohane
- **Created:** 2026-07
- **Affects:** `Popover` (now generic compound), the filters; adds `Checkbox`, `RemovableTag`,
  `ButtonBar`, `FilterTrigger`

## Summary

Move the filters from composition-by-configuration (many props) to composition-by-children:
a generic compound `Popover`, three reusable menu primitives, and filters that accept the
trigger as a child.

## Motivation

RFC 0002 made the filters configurable but not *composable* — the trigger, option rows,
selected chips, and footer were locked inside `MultiSelectFilter`, and `FilterPopover` only
ever drove a filter pill. You couldn't reach in and rearrange, or reuse the pieces elsewhere.
A design system needs parts that compose.

## Proposal

- **Generic `Popover`** (compound, context): `<Popover><Popover.Trigger>{trigger}</Popover.Trigger>
  <Popover.Content>{({close}) => menu}</Popover.Content></Popover>`. Owns open state
  (`useControllableState`), shares `{isOpen, close}` via `usePopover()`, and bridges to Astryx's
  Popover — cloning the trigger child with Astryx's anchor/ARIA wiring (via `mergeSlot`) and
  passing the content. Replaces `FilterPopover`.
- **Primitives**: `Checkbox` (box+label, controlled), `RemovableTag` (×+label, `onRemove`),
  `ButtonBar` (menu footer). Each stands alone and carries the guardrailed slot props.
- **`FilterTrigger`**: the default pill trigger (Button `pill` + caret rotating on
  `usePopover().isOpen`). The filters use it when no trigger child is given.
- **Filters as assemblies**: `MultiSelectFilter`/`SingleSelectFilter` compose `Popover` + the
  primitives, and accept the trigger as a render-prop child: `{({count, isActive}) => <…/>}`.
  Draft/Apply and controllable state are unchanged. Both a convenience component *and* the parts.

## Alternatives considered

- **Headless-only** (a `useMultiSelectFilter` hook, assemble everything at the call site). More
  composable but no convenience wrapper; every consumer writes the assembly. Rejected in favour
  of "both levels".
- **Positional children** on Popover (first child = trigger, second = content) instead of named
  `Popover.Trigger`/`Popover.Content`. Rejected: named parts are explicit and robust; positional
  is order-dependent and magical.
- **Astryx `anchorRef` mode** (Astryx mutates the anchor's DOM handlers). Rejected: keeps the
  proven render-prop bridge, so dismissal/focus/anchoring behave exactly as before.

## Migration & compatibility

Filter APIs stay source-compatible (the trigger child is optional; `formatTriggerLabel` still
drives the default). `FilterPopover` is removed — it was internal. Rendered output is
pixel-identical (visual-regression baselines unchanged).

## Accessibility

Unchanged: `Checkbox` keeps the real native input + focus-within ring; `RemovableTag`'s × keeps
its required label; the menus keep their roles. The compound `Popover` inherits Astryx's dialog
semantics, focus management, and dismissal.

## Open questions

- A fully headless `useMultiSelectFilter` could sit under the convenience component later, if a
  consumer needs to assemble a non-standard menu. Deferred until there's a real need.
