# Approach

The page is the demo; the deliverable is a component system. Every decision below optimizes
for the same thing: **many engineers shipping on these components without breaking each other.**

## Composability — three layers, pick your altitude

- **Configure the convenience component.** `MultiSelectFilter` covers the common case; every
  string, the match predicate (`filterOption`), menu placement, and option content
  (`renderOptionLabel` / `renderSelectedLabel`) are props. Defaults pin the Figma exactly.
- **Swap a part.** The trigger is a child, not a config: `{({count, isActive}) => <YourButton/>}`.
  `Popover` is compound — `<Popover><Popover.Trigger/><Popover.Content/></Popover>` — with
  state shared via context (`usePopover`).
- **Assemble from primitives.** `Popover`, `Checkbox`, `RemovableTag`, `ButtonBar`, `Input`,
  `Button`, `IconButton`, `Icon`, `Table<T>`, `Pagination` all stand alone. A non-standard
  menu is built from the same parts the filters use — no forking.
- Ship **both** the parts and the assembly. Headless-only pushes boilerplate onto every
  consumer; config-only walls off the internals. The pair is what scales.

## Scalability — decisions that survive growth

- **Generic where the data varies**: `Table<T>` takes `Column<T>[]`; filters are generic over
  the option value type; `Pagination` knows nothing about what it pages.
- **Controlled *and* uncontrolled** via one hook (`useControllableState`): page-level
  orchestration when you need it, drop-in local state when you don't.
- **State lives at the right altitude**: pure logic in `lib/` (unit-tested), page state in a
  hook, component state internal only where it's truly internal (the multi-select's draft).
- **Derived over stored**: the current page number is clamped at render, so filter changes
  can never strand the UI in an impossible state.

## Consistency — one source of truth per concern

- **Tokens** (`theme/tokens.stylex.ts`) are *measured from Figma by script*
  (`npm run tokens`), not eyeballed. Components never hard-code a color, size, or space.
- **Style registry** (`theme/componentStyles.ts`): each component's colocated `.styles.ts`
  rolls up into one object — the whole system's styling is visible, and overridable, in one place.
- **Shared primitives make consistency structural**: there is exactly one Button, one focus
  ring, one menu surface, one motion curve. Two filters can't drift apart because they're
  built from the same parts.
- **Visual-regression baselines** turn "pixel-perfect" from a claim into a CI gate.

## Guardrails — how this rolls out across an eng team

The thesis: **extension points are only safe if correctness cannot be handed to the consumer.**
Every flexible surface here has a hard edge the consumer cannot cross.

- **The slot-prop merge policy** (`mergeSlot`, exported): every internal element exposes a
  typed `<part>Props` slot, merged so the component's controlled values, `id`, required ARIA,
  and compiled StyleX classes *always win*; `className` concatenates; everything else passes
  through. You can decorate any element; you can't break it.
- **Critical props after the spread.** At composition sites the invariant is ordering:
  `Pagination` spreads `nextButtonProps` *then* re-applies navigation `onClick`/`disabled` —
  an arrow can be relabelled, never un-wired. The filter's inner search takes `searchProps`
  but its `value`/`onChange` are re-applied last — it can't be detached from filtering.
  **Tests assert the guardrails themselves** (a consumer trying `onClick`/`value` hijacks loses).
- **Render props scope what's customizable**: `renderOptionLabel` hands you the *content* of
  an option row — the toggle machinery, roles, and keyboard behavior are not on offer.
- **Accessibility is platform-backed, not re-implemented**: real `<input type="checkbox">`,
  real buttons, `menuitemradio` for pick-one menus, mandatory `label` on every icon-only
  button (a required prop — the type system is the guardrail). Axe runs per component state
  in CI *and* live in every Storybook story.
- **Styling has one escape hatch** (`xstyle`, merged last) instead of arbitrary overrides —
  visible in review, token-first by default.
- **Process guardrails**: a component *definition of done* in `CONTRIBUTING.md` (the checklist
  reviewers actually run), an RFC gate for public-API changes (RFCs 0001–0003 are worked
  examples), changesets enforced by CI (a PR touching shipped code without one fails),
  CODEOWNERS on the highest-blast-radius paths (primitives, tokens, governance), and a
  CI pipeline: typecheck → unit → build → e2e → axe → visual.

## Trade-offs made knowingly

- 40 tracks instead of the mock's 10 (pagination actually paginates) — first paint reads
  "1 of 4"; reverting is one line.
- The style registry couples all component styles into one module — fine at this scale,
  subpath exports when it isn't.
- Astryx is v0.1.x; its popover surface and CSS pipeline needed documented workarounds
  (see README notes). The bet: agent-ready, StyleX-native, and the popover's anchor
  positioning/focus/dismissal are exactly the hard parts worth inheriting.
