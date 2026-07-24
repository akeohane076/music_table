# Contributing

How changes get into this component set. The bar is deliberately explicit: a shared
library's cost is paid by every consumer, so consistency and a11y are gates, not nice-to-haves.

## Component "definition of done"

A component isn't done when it renders. It's done when every box below is checked. This is
the checklist a reviewer runs against a PR that adds or changes a component.

**API**
- [ ] Fully controlled (`value` + `onChange`) unless there's a reason not to; document it.
- [ ] Props are typed, `readonly`, and generic over the value type where it applies.
- [ ] User-facing strings are props (i18n-ready), with sensible English defaults.
- [ ] Exported from the package barrel (`components/filters/index.ts`) with its prop type.

**Styling**
- [ ] Every value is a token from `theme/tokens.stylex.ts` — no hard-coded colors, sizes,
      or spacing. New design values are added as tokens, not inlined.
- [ ] Logical properties (`inset-inline`, `padding-block`) so RTL is free.
- [ ] Composes shared primitives (`FilterPill`, `FilterPopover`, `menuCard`) rather than
      re-implementing trigger/surface/motion.

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
