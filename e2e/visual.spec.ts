import {expect, test, type Page} from '@playwright/test';

/**
 * Visual-regression baselines. These turn "pixel-perfect" into a gate: a stray padding
 * or colour change fails CI with a diff image. Animations are disabled so snapshots are
 * deterministic. Baselines are platform-specific — regenerate with `--update-snapshots`
 * and, in CI, run in the same container the baselines were captured in.
 */

test.use({viewport: {width: 1280, height: 800}});

const shot = (page: Page, name: string) =>
  expect(page).toHaveScreenshot(name, {animations: 'disabled', fullPage: true});

test('songs page — default', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('table')).toBeVisible();
  await shot(page, 'songs-default.png');
});

test('artist menu — open with selections', async ({page}) => {
  await page.goto('/');
  await page.locator('button[aria-haspopup="dialog"]').filter({hasText: 'Artist'}).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('checkbox', {name: 'Billie Eilish'}).check();
  await dialog.getByRole('checkbox', {name: 'Kendrick Lamar'}).check();
  await expect(dialog.getByText('Selected (2)')).toBeVisible();
  await expect(dialog).toHaveScreenshot('artist-menu.png', {animations: 'disabled'});
});

test('genre menu — open', async ({page}) => {
  await page.goto('/');
  await page.locator('button[aria-haspopup="dialog"]').filter({hasText: 'Genre'}).click();
  await expect(page.getByRole('menu', {name: 'Genre'})).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveScreenshot('genre-menu.png', {
    animations: 'disabled',
  });
});

test('empty state', async ({page}) => {
  await page.goto('/');
  await page.getByRole('searchbox', {name: /search songs/i}).fill('zzzzz');
  await expect(page.getByText('No songs match your filters.')).toBeVisible();
  await shot(page, 'empty-state.png');
});

test('mobile — filter bar wraps', async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto('/');
  await expect(page.getByRole('table')).toBeVisible();
  await shot(page, 'songs-mobile.png');
});
