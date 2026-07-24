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

## Prop spreading

Composability rests on three conventions, applied consistently:

- **Root spread + ref.** A primitive forwards `ref` and spreads `...rest` onto its root
  element, so callers keep full access to native attributes, ARIA, and event handlers
  (`<Button {...triggerProps} />` is how Astryx's Popover wires the trigger).
- **Named slot-props** for a component's internal parts, spread *after* the defaults so they
  override: `Pagination` takes `prevButtonProps` / `nextButtonProps`, `Input` takes
  `inputProps`, `Table` takes `tableProps`. Add one per meaningfully-targetable inner element.
- **`xstyle` escape hatch.** Every primitive accepts a StyleX `xstyle` merged last into
  `stylex.props(...)`, for one-off overrides that don't warrant a new prop or token (e.g. the
  table's sortable header neutralising the Button's geometry). Prefer a token; reach for
  `xstyle` only for genuinely local adjustments.

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
