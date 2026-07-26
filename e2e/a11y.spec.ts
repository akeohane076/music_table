import AxeBuilder from '@axe-core/playwright';
import {expect, test, type Page} from '@playwright/test';

/**
 * Automated accessibility scans against the real accessibility tree — including
 * color-contrast, which jsdom-based axe can't evaluate. Each meaningful UI state gets
 * its own scan, since a closed popover can't violate anything an open one might.
 */

const scan = (page: Page) =>
  new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

test('songs page has no violations on load', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('table')).toBeVisible();
  expect((await scan(page).analyze()).violations).toEqual([]);
});

test('artist menu (open, with a selection) has no violations', async ({page}) => {
  await page.goto('/');
  await page.locator('button[aria-haspopup="dialog"]').filter({hasText: 'Artist'}).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('checkbox', {name: 'ABBA'}).check();
  await expect(dialog.getByText('Selected (1)')).toBeVisible();
  expect((await scan(page).analyze()).violations).toEqual([]);
});

test('genre menu (open) has no violations', async ({page}) => {
  await page.goto('/');
  await page.locator('button[aria-haspopup="dialog"]').filter({hasText: 'Genre'}).click();
  await expect(page.getByRole('menu', {name: 'Genre'})).toBeVisible();
  expect((await scan(page).analyze()).violations).toEqual([]);
});

test('empty-result state has no violations', async ({page}) => {
  await page.goto('/');
  await page.getByRole('searchbox', {name: /search songs/i}).fill('zzzzz');
  await expect(page.getByText('No songs match your filters.')).toBeVisible();
  expect((await scan(page).analyze()).violations).toEqual([]);
});

// Alternate filter configurations live in Storybook, where the a11y addon runs axe
// live in every story; the states above cover the app's own surfaces.
