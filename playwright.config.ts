import {defineConfig, devices} from '@playwright/test';

/**
 * E2e, accessibility, and visual-regression tests run against the real Vite dev server.
 * Kept separate from the Vitest suite (which covers logic and component behaviour in
 * jsdom) because these need a real browser — notably the popover reopen flow that jsdom
 * cannot exercise, and axe's color-contrast checks that need real layout.
 */
export default defineConfig({
  testDir: './e2e',
  // Prod-bundle smoke tests run under playwright.prod.config.ts against `vite preview`.
  testIgnore: 'prod-smoke.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  // Reuse the running dev server locally; start a fresh one in CI.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
