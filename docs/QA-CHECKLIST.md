# Manual QA Checklist

A pass through everything a reviewer (or you, before submitting) should verify by hand.
Grouped by area; each item is an action → expected result. Run `npm run dev` first.

Legend: ☐ to check · 🔑 keyboard-only path · ♿ screen-reader path

---

## 1. Search

- ☐ Type `haze` → table narrows to titles containing "haze" (Purple Haze).
- ☐ Type `abba` → rows appear whose **artist** is ABBA, even though no title contains "abba" (search spans title, artist, and genre).
- ☐ Type `rock` → rows whose **genre** is Rock.
- ☐ Search is case-insensitive (`ROCK` == `rock`).
- ☐ A clear (✕) button appears only once there is text; the empty field shows none.
- ☐ Click ✕ → field empties, full list returns, focus stays usable.
- ☐ Leading/trailing spaces don't break matching (`  bad ` still finds Bad Guy).
- ☐ Typing resets pagination to page 1.
- 🔑 Tab to the field, type, Tab to the ✕, Enter clears it.

## 2. Single-select filter (Genre)

- ☐ Click **Genre** → menu opens directly below, left-aligned, 120px wide with 12px padding top and bottom.
- ☐ Menu lists Hip-Hop, Pop, Rock — no search box, no checkboxes, no Apply button.
- ☐ Click a genre → applies immediately, menu closes, table filters, trigger reads **`Genre: Rock`** and gains a dark outline.
- ☐ Re-open and click the **same** genre → clears it (trigger back to `Genre`, filter removed).
- ☐ Hover an option → row highlights.
- ☐ Selecting a genre resets pagination to page 1.
- 🔑 Enter/Space on the pill opens; Tab moves through options; Enter selects; Esc closes and returns focus to the pill.

## 3. Multi-select filter (Artist) — the important one

**Draft vs. commit**

- ☐ Open **Artist**, check two artists → the **Selected (N)** count and list update, but the trigger still reads `Artist` and the table has **not** changed.
- ☐ Click **Apply** → menu closes, table filters, trigger reads **`Artist (2)`** with a dark outline.
- ☐ Re-open → the two boxes are still checked (draft re-seeded from the committed value).
- ☐ Open, check a third, press **Esc** (or click outside) → menu closes, nothing changes: trigger still `Artist (2)`, table unchanged. The third selection was discarded.
- ☐ Open, uncheck everything, press **Esc** → still `Artist (2)` (discarded).

**Clear All**

- ☐ With selections present, click **Clear All** → the draft empties (Selected (0)) but the menu stays open and the table is unchanged until Apply.
- ☐ Clear All then Esc → original selection is still applied (Clear All is undoable by dismissing).
- ☐ Clear All then Apply → filter is removed, trigger back to `Artist`.

**Selected column**

- ☐ Each selected artist shows in the right column with a ✕.
- ☐ Click a ✕ → removes that one from the draft (unchecks it on the left too).
- ☐ Selected items animate in (unless reduced motion is on — see §7).

**In-menu search**

- ☐ Type in **Search Artists** → the left list filters; the Selected column is unaffected.
- ☐ A selected artist that's filtered out of the left list stays selected (search narrows the list, not the selection).
- ☐ Search that matches nothing → shows the empty message, Selected column intact.

**Overflow**

- ☐ The option list scrolls within the menu; the vertical divider stops at the footer and never runs past it; the last row never overlaps the Clear All / Apply bar.

- 🔑 Open with Enter; Arrow Down / Arrow Up move focus through the checkboxes and wrap at the ends; Space toggles; Tab reaches Clear All and Apply; Esc closes and returns focus to the pill.

## 4. Table: sorting & pagination

- ☐ **Title** and **Artist** headers show a sort arrow; **Genre** does not.
- ☐ Click **Title** → toggles ascending/descending; the arrow flips vertically; the active arrow is dark (#212121), inactive is grey (#BDBDBD).
- ☐ Click **Artist** → sorts by artist; Title's arrow goes inactive.
- ☐ `DNA.` sorts after `Dancing Queen` (reader-friendly, not raw ASCII).
- ☐ Pagination reads `1 of 4` with 40 tracks; ‹ is disabled on page 1, › disabled on the last page.
- ☐ Change page → rows update; the label updates.
- ☐ Apply a filter that shrinks results below the current page → you are pulled back to a valid page, never stranded on a blank one.
- 🔑 Sort headers and pager arrows are reachable and activatable by keyboard.
- ♿ Sorted column announces `aria-sort` ascending/descending; the page label is in a live region.

## 5. Combined filters

- ☐ Search + Artist + Genre together intersect (a row must satisfy all three).
- ☐ A combination with no matches (e.g. Artist = ABBA + Genre = Rock) → the table shows the empty state "No songs match your filters." spanning all columns.
- ☐ Clearing one filter widens the results correctly.

## 6. Responsive

- ☐ At ~1280px the layout matches the design (search 300px, pills to its right).
- ☐ Narrow to tablet (~768px) → the card and table stay usable; the filter bar wraps if needed.
- ☐ Mobile (~375px) → search goes full-width, pills wrap below, the table scrolls **inside its own container**, and the page itself never scrolls horizontally.
- ☐ The multi-select menu never exceeds the viewport width (`max-width: calc(100vw - 32px)`).

## 7. Accessibility & motion

- ☐ Every interactive element has a visible focus ring when tabbed to (not on mouse click).
- ☐ Checkboxes are real `<input type="checkbox">` — screen readers announce checked state and labels.
- ☐ Filter triggers announce as buttons with `aria-haspopup="dialog"` and `aria-expanded`.
- ☐ Turn on **Reduce Motion** (macOS: System Settings → Accessibility → Display) → menus and chips appear instantly, no animation.
- ♿ With VoiceOver/NVDA: open a filter, confirm the dialog is announced, options are reachable, and closing returns focus to the trigger.

## 8. Cross-browser & routes

- ☐ Verify in Chrome, Safari, and Firefox (StyleX `light-dark()` handling differs; the build targets these).
- ☐ `/kitchen-sink` renders all filter configurations; each is independently interactive.
- ☐ Hard-refresh on `/kitchen-sink` → still loads (SPA rewrite in `vercel.json`).
- ☐ `npm run build && npm run preview` → the production build behaves the same as dev.

## 9. Fidelity spot-checks (against Figma)

- ☐ Page background #F5F5F5, card white with 12px radius, filter bar above the card.
- ☐ Pills: 40px tall, fully rounded, 12px labels at weight 600.
- ☐ Genre menu 120×144; Artist menu 500px wide with a 295px body.
- ☐ Accent #006088 on checked boxes, Apply, and the Clear All outline.
