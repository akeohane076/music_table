import type {StorybookConfig} from '@storybook/react-vite';
import {astryxStylex} from '@astryxdesign/build/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {name: '@storybook/react-vite', options: {}},

  // Storybook's Vite builder doesn't inherit the app's vite.config, so the Astryx StyleX
  // plugins must be added here or components render unstyled (class names with no compiled
  // CSS). They must run BEFORE Storybook's React plugin — StyleX rewrites `stylex.create`
  // at the Babel layer ahead of the JSX transform — so we prepend rather than merge/append.
  async viteFinal(base, {configType}) {
    const dev = configType === 'DEVELOPMENT';
    return {
      ...base,
      // Astryx collects StyleX rules into a virtual CSS file served by its own dev
      // middleware — but that middleware locates the collecting plugin by scanning
      // Vite's plugin graph, and under Storybook's builder it can't find it, so the
      // virtual stylesheet comes back empty and components render unstyled. Flip StyleX
      // to runtime injection (rules injected as <style> tags at module eval) so styling
      // needs no CSS-file plumbing. This is a Storybook-only override; the app keeps
      // Astryx's default static-CSS path for a lean production build.
      plugins: [...astryxStylex({dev, stylexOverrides: {runtimeInjection: true}}), ...(base.plugins ?? [])],
    };
  },
};

export default config;
