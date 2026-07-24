import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {astryxStylex} from '@astryxdesign/build/vite';

export default defineConfig({
  // astryxStylex() must precede the React plugin so StyleX compiles before JSX transform.
  plugins: [...astryxStylex(), react()],
  test: {
    // Scoped to src so Vitest never picks up the Playwright specs under e2e/.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
