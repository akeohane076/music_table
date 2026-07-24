# Songs — UI Engineer Take-Home

A pixel-accurate implementation of the provided Figma page: a filterable, sortable songs
table with a reusable search field and two reusable filter components.

Built with **Vite + React 19 + TypeScript**, styled with **StyleX** via
[Astryx](https://astryx.atmeta.com/) (Meta's design system).

## Running locally

Requires **Node 20+** (`.nvmrc` pins 22).

```bash
nvm use
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run preview` | Serve the production build |
| `npm test` | Run the unit + component tests (Vitest) |
| `npm run test:e2e` | Run e2e, accessibility, and visual-regression tests (Playwright) |
| `npm run storybook` | Component explorer with every state + the a11y addon |
| `npm run tokens` | Re-extract design tokens from Figma (needs `FIGMA_TOKEN`) |

## Routes

- `/` — the page from the Figma.
- `/kitchen-sink` — the same three filter components under six different
  configurations. Included as evidence for the "reusable and easily configurable"
  requirement: nothing there is a variant or a second implementation, just different props.

## The three required components

All three live in `src/components/filters/` and share a single `FilterPill` trigger and a
single `FilterOption` shape, so hit area, focus ring, and active treatment are defined once.

```tsx
<SearchInput value={q} onChange={setQ} placeholder="Search by title, artist or genre" />

<SingleSelectFilter label="Genre" options={genres} value={genre} onChange={setGenre} />

<MultiSelectFilter label="Artist" options={artistOptions} value={artists} onChange={setArtists} />
```

### The multi-select is Apply-gated; the single-select is not

This asymmetry is in the design — the artist popover has Apply and Clear All, the genre
popover has neither — and it is deliberate rather than an inconsistency to smooth over.

The artist popover edits a **draft** copy of the selection. Checking boxes changes nothing
on the page until **Apply**; dismissing (Escape, outside click, or the trigger) throws the
draft away, and reopening re-seeds it from the committed value. Without a discard path there
would be nothing for Apply to mean. **Clear All** empties the draft rather than committing,
so it stays undoable by dismissing — consistent with every other control in the panel.

A single choice has nothing to batch, so the genre filter commits on click; an Apply step
would only add a click.

### Accessibility

Real `<input type="checkbox">` elements (visually replaced, not re-implemented) so checked
state, labelling, and keyboard activation come from the platform. Arrow keys walk the option
list, the table exposes `aria-sort`, and pagination is a labelled `<nav>` with a live region.
All motion sits behind `prefers-reduced-motion`.

## Design tokens

`src/theme/tokens.stylex.ts` holds **measured values pulled from the Figma file**, not values
eyeballed from screenshots. `scripts/extract-figma-tokens.mjs` reads the file through the
Figma REST API and reports every fill, stroke, text style, radius, shadow, and spacing value
by frequency.

To re-run it, put a Figma token with the *File content → read* scope in `.env.local`:

```
FIGMA_TOKEN=figd_...
```

```bash
npm run tokens
```

The extractor **skips hidden nodes**. The file contains hidden layout scaffolding
(`#D9D9D9` / `#9E9E9E` rectangles) whose colours would otherwise have polluted the palette.

## Notes for reviewers

**Where I departed from the design, and why:**

- **40 tracks instead of 10.** The mock shows ten rows and reads "1 of 1", so pagination
  never paginates. The wider dataset exercises pagination and gives the artist filter's own
  search enough options to matter. The trade-off: first paint reads **"1 of 4"** and the
  first page is not the mock's ten rows. Reverting is a one-line change in `src/data/tracks.ts`.
- **Responsive behaviour.** The Figma is a single fixed 1280px frame with no tablet or mobile
  artboards. Below that the layout stays fluid, the filter bar wraps, and the table scrolls
  inside its own container rather than overflowing the page.
- **States the design doesn't specify.** Hover, focus-visible and disabled treatments, plus
  the empty-result state, are derived from the design's own language.

**Astryx notes**, since it is a very new library (v0.1.8):

- Its `Popover` ships a dark themed surface; both filters reset it via `xstyle` to a
  positioning shell so the panel can be the design's flat white 4px card. The popover still
  does the work worth inheriting — anchor positioning, focus management, dismissal.
- `astryx.css` is deliberately **not** imported. The build plugin aliases
  `@astryxdesign/core` to its source and StyleX compiles from there, so the prebuilt
  stylesheet is unnecessary — and it ships only in `dist/`, which that alias makes
  unreachable. The published getting-started guide's CSS import does not apply to the Vite path.
- Astryx 0.1.8 requires Vite 8 and `@vitejs/plugin-react` 6.
- **Storybook** uses StyleX runtime injection (`stylexOverrides: {runtimeInjection: true}` in
  `.storybook/main.ts`). Astryx's default collects StyleX rules into a virtual CSS file served
  by a dev middleware that can't locate its plugin inside Storybook's builder; runtime
  injection sidesteps that. The app keeps Astryx's static-CSS path for a lean prod build.

## Testing

Two layers, by design — fast logic/behavior in jsdom, real-browser truth in Playwright:

- **Vitest** (`npm test`) — `src/lib/filtering.ts` pure logic (incl. the design's `ab` → ABBA
  example) and `MultiSelectFilter`'s full draft / Apply / discard cycle.
- **Playwright** (`npm run test:e2e`) — three real-browser suites:
  - *e2e* — filter flows, including the multi-select **reopen** cycle jsdom can't do.
  - *accessibility* — axe scans per state (found and fixed a nested-interactive and a
    contrast issue during development).
  - *visual regression* — committed screenshot baselines that gate pixel drift.
- **Storybook** (`npm run storybook`) — every component state, with the a11y addon running
  axe live in each story.

One caveat, documented at the test: Astryx's popover can't be *reopened* under jsdom, so that
path is covered in Playwright, not Vitest.
