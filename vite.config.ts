import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {astryxStylex} from '@astryxdesign/build/vite';

export default defineConfig({
  // astryxStylex() must precede the React plugin so StyleX compiles before JSX transform.
  plugins: [...astryxStylex(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
