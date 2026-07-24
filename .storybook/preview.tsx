import type {Preview} from '@storybook/react-vite';
import type {ReactRenderer} from '@storybook/react-vite';
import type {Decorator} from '@storybook/react-vite';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

// Same global stylesheets and font faces the app loads in main.tsx.
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-600.css';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/theme-neutral/theme.css';
// The `@stylex;` directive in this file is the injection point the Astryx plugin replaces
// with the compiled StyleX stylesheet — without it, components render as bare class names.
import '../src/index.css';

import {color, font} from '../src/theme/tokens.stylex.ts';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  canvas: {
    fontFamily: font.family,
    color: color.textPrimary,
    // The filters live on the gray page in the app; mirror that so tokens read in context.
    backgroundColor: color.pageBg,
    padding: '24px',
    minHeight: '260px',
  },
});

// Every story renders inside the Astryx Theme, exactly as the app does.
const withTheme: Decorator = (Story) => (
  <Theme theme={neutralTheme}>
    <div {...stylex.props(styles.canvas)}>
      <Story />
    </div>
  </Theme>
);

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {matchers: {color: /(background|color)$/i, date: /Date$/i}},
    a11y: {test: 'error'},
  },
  tags: ['autodocs'],
};

export default preview;
export type {ReactRenderer};
