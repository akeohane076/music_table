import {defineConfig, devices} from '@playwright/test';

/**
 * Smoke tests against the PRODUCTION bundle (`vite build` + `vite preview`), not the dev
 * server. Exists because the two pipelines genuinely differ: Astryx's production compile
 * dropped a dynamic StyleX merge that dev preserved, shipping a dark frame around the
 * filter menus that no dev-server test could catch.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: 'prod-smoke.spec.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'on-first-retry',
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  webServer: {
    command: 'npm run build && npx vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
