import * as stylex from '@stylexjs/stylex';
import {Theme} from '@astryxdesign/core/theme';
// The prebuilt theme ships its CSS statically; importing from the package root instead
// makes Astryx inject theme styles at runtime and warns about the cost.
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

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

// Two static routes don't warrant a routing library — and react-router carries a long
// CVE history in the SSR/RSC paths this client-only SPA never touches. A pathname switch
// is enough; vercel.json rewrites every path to index.html so deep links still resolve.
function CurrentPage() {
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '/kitchen-sink' ? <KitchenSink /> : <SongsPage />;
}

export function App() {
  return (
    <Theme theme={neutralTheme}>
      <div {...stylex.props(styles.page)}>
        <main {...stylex.props(styles.shell)}>
          <CurrentPage />
        </main>
      </div>
    </Theme>
  );
}
