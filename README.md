# Songs — UI Engineer Take-Home

Pixel-accurate implementation of the provided Figma: a filterable, sortable songs table with
a reusable **SearchInput**, **SingleSelectFilter**, and **MultiSelectFilter**, built as a small
composable component system.

**Stack:** Vite · React 19 · TypeScript · StyleX via [Astryx](https://astryx.atmeta.com/) (Meta's design system)

📐 **[APPROACH.md](APPROACH.md)** — the choices: composability, scalability, consistency, and
the guardrails for rolling this out across a team. RFCs for each major decision are in
[docs/rfcs/](docs/rfcs/).

## Run it

Requires Node 20+ (`.nvmrc` pins 22).

```bash
nvm use && npm install && npm run dev   # → http://localhost:5173
```

| Script | |
| --- | --- |
| `npm run dev` / `npm run build` / `npm run preview` | app dev / prod build / serve build |
| `npm test` | unit + component tests (Vitest) |
| `npm run test:e2e` | e2e + axe accessibility + visual regression (Playwright) |
| `npm run storybook` | every component and state, with live axe checks |
| `npm run tokens` | re-extract design tokens from Figma (needs `FIGMA_TOKEN` in `.env.local`) |

**Routes:** `/` — the Figma page · `/kitchen-sink` — the same components under many
configurations (custom triggers, custom option rendering, uncontrolled mode). Deployed,
Storybook lives at `/storybook`.

## The components in 20 seconds

```tsx
// Configure the common case (defaults pin the Figma exactly)…
<MultiSelectFilter label="Artist" options={artists} value={v} onChange={setV} />

// …swap the trigger (composition, not config)…
<MultiSelectFilter label="Artist" options={artists} defaultValue={['ABBA']}>
  {({count}) => <Button variant="outline">Artists · {count}</Button>}
</MultiSelectFilter>

// …or assemble your own from the same parts the filters use.
<Popover label="Anything">
  <Popover.Trigger><Button>Open</Button></Popover.Trigger>
  <Popover.Content>{({close}) => <MyMenu onDone={close} />}</Popover.Content>
</Popover>
```

The multi-select edits a **draft** committed only on Apply — dismissing discards, Clear All
stays undoable. The single-select applies on click (nothing to batch). That asymmetry is in
the design, on purpose.

## Notes for reviewers

- **Design tokens are measured, not eyeballed** — `scripts/extract-figma-tokens.mjs` reads the
  Figma file via API; `theme/tokens.stylex.ts` holds the results. Visual-regression baselines
  gate any drift.
- **Deliberate deviation:** 40 tracks instead of the mock's 10, so pagination actually works —
  first paint reads "1 of 4" (one-line revert in `src/data/tracks.ts`).
- **Astryx (v0.1.x) notes:** its Popover ships a dark surface we reset to a positioning shell;
  `astryx.css` must *not* be imported on the Vite path (the build plugin compiles from source);
  Storybook needs StyleX runtime injection (`.storybook/main.ts`). Requires Vite 8.
- **jsdom caveat:** Astryx's popover can't *reopen* under jsdom (CSS anchor positioning), so
  reopen flows are covered in Playwright, not Vitest — documented at the affected tests.
- Manual QA checklist: [docs/QA-CHECKLIST.md](docs/QA-CHECKLIST.md) · Next steps: [docs/ROADMAP.md](docs/ROADMAP.md)
