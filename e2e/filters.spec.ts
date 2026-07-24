import {expect, test, type Page} from '@playwright/test';

/**
 * Real-browser coverage of the filter flows — the parts jsdom can't reach, above all
 * the multi-select's open → edit → dismiss → reopen cycle (Astryx's popover relies on
 * CSS anchor positioning that jsdom doesn't implement, so it can't be reopened there).
 */

// The filter triggers carry aria-haspopup="dialog", which disambiguates them from the
// sortable "Artist" column header (also a button).
const artistPill = (page: Page) =>
  page.locator('button[aria-haspopup="dialog"]').filter({hasText: 'Artist'});
const genrePill = (page: Page) =>
  page.locator('button[aria-haspopup="dialog"]').filter({hasText: 'Genre'});
const rowCount = (page: Page) => page.locator('tbody tr').count();

/**
 * Open a filter menu, waiting for any previous menu to finish closing first. Astryx's
 * popover toggles on click, so a click that lands while the menu is still animating
 * closed would toggle it back — this guards the reopen flows against that race.
 */
async function openMenu(page: Page, pill: ReturnType<typeof artistPill>) {
  await expect(page.getByRole('dialog')).toBeHidden();
  // Astryx briefly guards the trigger against reactivation right after a dismissal, so a
  // too-fast reopen click can be swallowed (a real user's natural delay clears it). Retry
  // until the menu actually opens, clicking only while it's still closed so an already-open
  // menu is never toggled shut.
  await expect(async () => {
    if (await page.getByRole('dialog').isHidden()) await pill.click();
    await expect(page.getByRole('dialog')).toBeVisible({timeout: 500});
  }).toPass({timeout: 6000});
}

test.beforeEach(async ({page}) => {
  await page.goto('/');
});

test('search matches across title, artist, and genre', async ({page}) => {
  const search = page.getByRole('searchbox', {name: /search songs/i});

  await search.fill('haze');
  await expect(page.getByRole('cell', {name: 'Purple Haze'})).toBeVisible();

  // "abba" matches by artist even though no title contains it.
  await search.fill('abba');
  await expect(page.getByRole('cell', {name: 'Dancing Queen'})).toBeVisible();
  await expect(page.locator('tbody')).not.toContainText(/abba/i, {ignoreCase: false});

  // Clear button restores the full list.
  await page.getByRole('button', {name: /clear search/i}).click();
  await expect(search).toHaveValue('');
});

test('single-select genre applies immediately and toggles off', async ({page}) => {
  await genrePill(page).click();
  await page.getByRole('menuitemradio', {name: 'Rock'}).click();

  await expect(genrePill(page)).toHaveText('Genre: Rock');
  const rows = await rowCount(page);
  for (let i = 0; i < rows; i++) {
    await expect(page.locator('tbody tr').nth(i).locator('td').nth(2)).toHaveText('Rock');
  }

  // Re-selecting the active option clears it.
  await genrePill(page).click();
  await page.getByRole('menuitemradio', {name: 'Rock'}).click();
  await expect(genrePill(page)).toHaveText('Genre');
});

test('multi-select commits only on Apply', async ({page}) => {
  await openMenu(page, artistPill(page));
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('checkbox', {name: 'ABBA'}).check();
  await dialog.getByRole('checkbox', {name: 'Queen'}).check();

  // Draft moved; the page has not.
  await expect(dialog.getByText('Selected (2)')).toBeVisible();
  await expect(artistPill(page)).toHaveText('Artist');

  await dialog.getByRole('button', {name: 'Apply'}).click();
  await expect(artistPill(page)).toHaveText('Artist (2)');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('multi-select discards the draft on Escape, and reopens re-seeded', async ({page}) => {
  // Commit an initial selection.
  await openMenu(page, artistPill(page));
  await page.getByRole('dialog').getByRole('checkbox', {name: 'ABBA'}).check();
  await page.getByRole('dialog').getByRole('button', {name: 'Apply'}).click();
  await expect(artistPill(page)).toHaveText('Artist (1)');

  // Reopen (the jsdom-impossible step), edit, then dismiss with Escape.
  await openMenu(page, artistPill(page));
  await expect(page.getByRole('dialog').getByRole('checkbox', {name: 'ABBA'})).toBeChecked();
  await page.getByRole('dialog').getByRole('checkbox', {name: 'Queen'}).check();
  await page.keyboard.press('Escape');

  // Nothing committed; the prior selection stands.
  await expect(artistPill(page)).toHaveText('Artist (1)');

  // Reopening shows the committed value, not the discarded draft.
  await openMenu(page, artistPill(page));
  await expect(page.getByRole('dialog').getByRole('checkbox', {name: 'ABBA'})).toBeChecked();
  await expect(page.getByRole('dialog').getByRole('checkbox', {name: 'Queen'})).not.toBeChecked();
});

test('Clear All empties the draft but only Apply commits it', async ({page}) => {
  await openMenu(page, artistPill(page));
  await page.getByRole('dialog').getByRole('checkbox', {name: 'ABBA'}).check();
  await page.getByRole('dialog').getByRole('button', {name: 'Apply'}).click();
  await expect(artistPill(page)).toHaveText('Artist (1)');

  await openMenu(page, artistPill(page));
  await page.getByRole('dialog').getByRole('button', {name: 'Clear All'}).click();
  await expect(page.getByRole('dialog').getByText('Selected (0)')).toBeVisible();

  // Dismissing after Clear All leaves the committed value intact.
  await page.keyboard.press('Escape');
  await expect(artistPill(page)).toHaveText('Artist (1)');
});

test('over-filtering shows the empty state and never strands a page', async ({page}) => {
  await openMenu(page, artistPill(page));
  await page.getByRole('dialog').getByRole('checkbox', {name: 'ABBA'}).check();
  await page.getByRole('dialog').getByRole('button', {name: 'Apply'}).click();

  await genrePill(page).click();
  await page.getByRole('menuitemradio', {name: 'Rock'}).click();

  // ABBA has no Rock tracks.
  await expect(page.getByText('No songs match your filters.')).toBeVisible();
  await expect(page.getByText(/1 of 1/)).toBeVisible();
});

test('keyboard: open the artist menu and toggle with the keyboard', async ({page}) => {
  await artistPill(page).focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Arrow into the list and toggle the first option.
  await dialog.getByRole('checkbox', {name: 'ABBA'}).focus();
  await page.keyboard.press('Space');
  await expect(dialog.getByText('Selected (1)')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(artistPill(page)).toBeFocused();
});
