import {expect, test, type Page} from '@playwright/test';

/**
 * Production-bundle smoke tests — see playwright.prod.config.ts for why these exist.
 * Assertions target the exact regression that shipped: Astryx's popover wraps content in a
 * dark padded surface, and the padding reset that hides it was silently dropped by the
 * production compile. These run against `vite preview`, the same artifact Vercel serves.
 */

const pill = (page: Page, label: string) =>
  page.locator('button[aria-haspopup="dialog"]').filter({hasText: label});

test('artist menu: no dark Astryx surface frames the card in the built app', async ({page}) => {
  await page.goto('/');
  await pill(page, 'Artist').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // The load-bearing reset: Astryx's inner padding div must be flat against the wrapper,
  // so the white menu card fully covers the dark surface underneath.
  const padding = await dialog.evaluate((el) => getComputedStyle(el.firstElementChild!).padding);
  expect(padding).toBe('0px');

  // And the card itself must be the design's flat white 4px panel.
  const card = await dialog.evaluate((el) => {
    const c = getComputedStyle(el.firstElementChild!.firstElementChild!);
    return {bg: c.backgroundColor, radius: c.borderRadius};
  });
  expect(card.bg).toBe('rgb(255, 255, 255)');
  expect(card.radius).toBe('4px');
});

test('genre menu: same reset holds for the single-select', async ({page}) => {
  await page.goto('/');
  await pill(page, 'Genre').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  const padding = await dialog.evaluate((el) => getComputedStyle(el.firstElementChild!).padding);
  expect(padding).toBe('0px');
  const bg = await dialog.evaluate(
    (el) => getComputedStyle(el.firstElementChild!.firstElementChild!).backgroundColor,
  );
  expect(bg).toBe('rgb(255, 255, 255)');
});

test('built app sanity: filters commit and the focus ring renders', async ({page}) => {
  await page.goto('/');

  // Search focus draws the single 1px #212121 inside stroke.
  const search = page.getByRole('searchbox', {name: /search songs/i});
  await search.focus();
  const ring = await search.evaluate((el) => getComputedStyle(el.closest('div')!).boxShadow);
  expect(ring).toContain('rgb(33, 33, 33)');
  expect(ring).toContain('inset');

  // A full select→apply round trip works in the bundle.
  await pill(page, 'Artist').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('checkbox', {name: 'ABBA'}).check();
  await dialog.getByRole('button', {name: 'Apply'}).click();
  await expect(pill(page, 'Artist')).toHaveText('Artist (1)');
});
