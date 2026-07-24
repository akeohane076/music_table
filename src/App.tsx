import * as stylex from '@stylexjs/stylex';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

import {SongsPage} from './routes/SongsPage.tsx';
import {KitchenSink} from './routes/KitchenSink.tsx';
import {color, font, size, space} from './theme/tokens.stylex.ts';

const styles = stylex.create({
  page: {
    minHeight: '100%',
    backgroundColor: color.pageBg,
    fontFamily: font.family,
    color: color.textPrimary,
  },
  shell: {
    // The design is a 1280px canvas with 24px gutters; it stays fluid below that.
    maxWidth: size.pageWidth,
    marginInline: 'auto',
    paddingInline: space.xl,
    paddingBlock: space.xl,
  },
});

export function App() {
  return (
    <Theme theme={neutralTheme}>
      <BrowserRouter>
        <div {...stylex.props(styles.page)}>
          <main {...stylex.props(styles.shell)}>
            <Routes>
              <Route path="/" element={<SongsPage />} />
              <Route path="/kitchen-sink" element={<KitchenSink />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Theme>
  );
}
