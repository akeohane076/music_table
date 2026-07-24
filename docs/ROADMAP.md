# Where this would go next

This take-home is scoped to one page and three components. If it were the seed of a real
design-system effort, here is where I'd take it — ordered so the highest-signal work for a
_design-systems_ practice comes first, not the highest line count.

## 1. Close the design→code loop (the flagship)

The tokens in `theme/tokens.stylex.ts` were **generated from Figma**, not eyeballed
(`scripts/extract-figma-tokens.mjs`). That script is the seed of the thing DS teams struggle
with most: keeping design and code in sync.

- Emit tokens in a **Style Dictionary / Tokens Studio** shape and generate the StyleX vars,
  so the token file is a build artifact, never hand-edited.
- A **CI job that diffs Figma against committed tokens** and opens a PR (or fails) on drift —
  design changes a radius, the repo gets a PR. This is the "how do you enforce consistency
  across the app" answer made mechanical.
- Split **primitive vs. semantic** tokens (`blue-600` → `color.accent`) so themes re-map
  meaning, not raw values.

## 2. Testing pyramid

| Layer | Status | Next |
| --- | --- | --- |
| Unit (pure filter/sort/pagination logic) | ✅ 11 tests | — |
| Component / interaction (draft→Apply→discard) | ✅ 7 tests | extend to single-select + search |
| **E2e (Playwright)** | ▢ | real-browser flows; covers popover **reopen**, which jsdom can't (see the note in `MultiSelectFilter.test.tsx`) |
| **Automated a11y** | ▢ | `axe-core` in Vitest for the DOM, `@axe-core/playwright` for the real a11y tree, per component state |
| **Visual regression** | ▢ | Playwright screenshots or Chromatic — turns "pixel-perfect" into a gate that catches drift automatically |

All of it behind a **CI pipeline**: typecheck → unit → component → a11y → visual → build.

## 3. Publish as a real component library

- `package.json` **exports map** with per-component subpaths, ESM, bundled `.d.ts`,
  `sideEffects` for tree-shaking, `react`/`stylex` as peer deps.
- **Storybook** with every component and every state, controls, and autodocs generated from
  the TSDoc already on the props.
- **Changesets** for semver + changelog; a component **"definition of done"** (a11y, tests,
  docs, tokens, RTL) as the contribution gate.

## 4. Component API depth (what scale demands)

The current filters are deliberately small and static. Production DS versions would add:

- **Async options** — loading/error/empty states, fetch-on-search (real filters hit an API).
- **Virtualized option lists** (`react-window`) so the multi-select handles thousands of
  options without jank. Debounced in-menu search to match.
- **Controlled _and_ uncontrolled** variants; the current API is controlled-only.
- Full **WAI-ARIA listbox/combobox** pattern: focus trap + return-to-trigger, type-ahead,
  Home/End, `aria-activedescendant`.
- **Select-all**, option groups, and option icons/descriptions for the multi-select.

## 5. Theming & i18n

- Astryx ships multiple themes — prove the components survive a **theme swap** (light/dark,
  a brand theme) with no per-component changes. That's the real test of a tokenized component.
- Layout already uses **logical properties** (`inset-inline`, `padding-block`), so **RTL** is
  mostly free — formalize it and add a mirrored snapshot. Externalize the few user-facing
  strings (`Apply`, `Clear All`, `No matches`) for i18n; they're already props.

## 6. DX & governance

- ESLint + Prettier + Stylelint, Husky pre-commit, bundle-size budget in CI.
- `CODEOWNERS`, a PR template, and a lightweight **RFC process** for breaking API changes —
  the governance a shared library needs once more than one team consumes it.

---

**If I had one more day before the review**, I'd do #2's Playwright + axe pass and a Storybook
with the component states — they're the most visible proof of DS rigor — and sketch #1 as the
architecture talking point, since the extraction script already exists to point at.
