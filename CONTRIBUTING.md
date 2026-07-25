# Contributing

How changes get into this component set. The bar is deliberately explicit: a shared
library's cost is paid by every consumer, so consistency and a11y are gates, not nice-to-haves.

## Component "definition of done"

A component isn't done when it renders. It's done when every box below is checked. This is
the checklist a reviewer runs against a PR that adds or changes a component.

**API**
- [ ] Controllable (`value` + `defaultValue` + `onChange` via `useControllableState`) for
      stateful components; presentational primitives take `value`/`onChange` directly.
- [ ] Props are typed, `readonly`, and generic over the value/row type where it applies.
- [ ] User-facing strings are props (i18n-ready), with sensible English defaults.
- [ ] Forwards `ref` and spreads `...rest` to its root element; composite components expose
      named slot-props (`inputProps`, `prevButtonProps`/`nextButtonProps`, `tableProps`) and a
      StyleX `xstyle` escape hatch. See "Prop spreading" below.
- [ ] Lives in its own `components/<Name>/` folder (`<Name>.tsx`, `<Name>.styles.ts`,
      `<Name>.stories.tsx`, `index.ts`) and is exported from the package barrel with its prop type.

**Styling**
- [ ] Styles live in the colocated `<Name>.styles.ts` and are referenced through the central
      registry (`theme/componentStyles.ts` → `styles.<name>.<slot>`), never inline in the `.tsx`.
- [ ] Every value is a token from `theme/tokens.stylex.ts` — no hard-coded colors, sizes,
      or spacing. New design values are added as tokens, not inlined.
- [ ] Logical properties (`inset-inline`, `padding-block`) so RTL is free.
- [ ] Composes the shared primitives (`Button`, `IconButton`, `Input`, `Icon`, `FilterPopover`)
      rather than re-implementing trigger/field/icon/surface/motion.

**Accessibility**
- [ ] Correct ARIA roles; verified with the axe suite (`npm run test:e2e`, a11y specs) —
      zero violations across the component's meaningful states.
- [ ] Full keyboard path: open, navigate, select, dismiss, and focus returns to the trigger.
- [ ] Native controls where possible (real `<input type="checkbox">`, not a div).
- [ ] All motion behind `prefers-reduced-motion`.

**Testing**
- [ ] Pure logic unit-tested (Vitest).
- [ ] Behavior covered by a component test (Testing Library) or an e2e flow (Playwright).
- [ ] A visual-regression baseline for each distinct visual state.

**Docs & versioning**
- [ ] TSDoc on the component and non-obvious props (Storybook autodocs read from it).
- [ ] A Storybook story per state/variant.
- [ ] A changeset (`npx changeset`) describing the change and its semver impact.

## Prop spreading — composition with guardrails

Every component exposes a **typed `<part>Props` slot for each meaningful internal element**,
so consumers can reach into the markup (add a handler, a `data-*`, an `aria-describedby`,
extra styling) without the component having to grow a bespoke prop for each case. But those
slots are merged under a **guardrail policy**, so composition can't break correctness:

- The component's own props **win** — controlled values, `id`, required ARIA/roles, and the
  compiled StyleX classes are protected.
- `className` is **concatenated** (consumer + component); `style` is shallow-merged with the
  component winning. A consumer extends styling, never erases it.
- Everything the component doesn't set passes straight through.

`mergeSlot(consumerProps, ownProps)` (`src/lib/slotProps.ts`, exported) encodes this for a
component's own element. At composition sites, place the component's critical props *after*
the consumer spread — e.g. `Pagination` spreads `nextButtonProps` then re-applies its
navigation `onClick`/`disabled`, so an arrow can be relabelled but not un-wired.

Every component covers its parts: `Button` (root + `labelProps`), `IconButton` (root),
`Input` (`rootProps`/`labelProps`/`inputProps`/`startIconProps`/`endIconProps`), `SearchInput`
(forwards those + `clearButtonProps`), `Pagination` (`rootProps`/`labelProps`/
`prevButtonProps`/`nextButtonProps`), `Table` (`tableProps`/`theadProps`/`tbodyProps`/
`rowProps` + per-`Column` `headerProps`/`cellProps`), and the filters (`triggerProps`).

- **`ref`** is forwarded to each primitive's primary element.
- **`xstyle`** is a StyleX escape hatch on every primitive, merged last into `stylex.props(...)`
  for one-off overrides that don't warrant a new token (e.g. the table header neutralising the
  Button's geometry). Prefer a token; reach for `xstyle` only for genuinely local adjustments.

## Compound components

Where a component has a trigger and a surface (or otherwise benefits from being assembled),
prefer **composition by children over configuration by props**. `Popover` is the model:
`<Popover><Popover.Trigger>{trigger}</Popover.Trigger><Popover.Content>{({close}) => …}</Popover.Content></Popover>`,
sharing state via context (`usePopover()`). Build such components as:

- a parent that owns state and provides context;
- named sub-parts (`Popover.Trigger`, `Popover.Content`) as the children;
- a render-prop where a child needs state (content gets `{close}`; the filters' trigger gets
  `{count, isActive}`).

Ship **both levels**: the composable parts *and* a convenience component that assembles them for
the common case (the filters accept a trigger child but default to `FilterTrigger`). Reusable
menu pieces — `Checkbox`, `RemovableTag`, `ButtonBar` — are their own primitives so a consumer
can assemble a different menu from them.

## Style registry

Component styles are defined in the colocated `<Name>.styles.ts` and rolled up in
`theme/componentStyles.ts` into a single `styles` object. Components reference their styles
through it (`styles.button.root`), so the whole system's styling is visible and overridable in
one place. The `.styles.ts` reads design tokens from `theme/tokens.stylex.ts`; it never
hard-codes values.

## Workflow

1. Branch from `main`.
2. Make the change; keep it green: `npm run build && npm test && npm run test:e2e`.
3. Run `npx changeset` and describe the change (patch/minor/major).
4. Open a PR using the template. A breaking API change needs an RFC first (see below).

## RFCs

Changes to a component's **public API** — new required props, renamed/removed props,
changed defaults, behavioral contracts — go through a lightweight RFC so consumers aren't
surprised. Copy `docs/rfcs/0000-template.md`, fill it in, and open it as its own PR for
discussion before the implementation PR. `docs/rfcs/0001-filter-component-api.md` is a
worked example (and the rationale for the current filter API).

## Versioning & release

[Changesets](https://github.com/changesets/changesets) drives semver and the changelog:

- `npx changeset` — record a change (run this in every PR that touches shipped code).
- `npm run version` — consume changesets, bump versions, update `CHANGELOG.md`.
- `npm run release` — build and publish.

Semver contract for this library: **major** = breaking API/markup/ARIA change a consumer
must react to; **minor** = new component or additive prop; **patch** = fix or internal
change with no API impact. Token value changes that alter appearance are **minor** (visual,
not API) and must ship with updated visual-regression baselines.
