import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Roboto is the design's only typeface. Self-hosted rather than loaded from a CDN so the
// page has no third-party request and no flash of fallback text.
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';

// No `astryx.css` import: the build plugin aliases @astryxdesign/core to its source and
// StyleX compiles component styles from there, so the prebuilt stylesheet would be dead weight
// (and only exists in dist/, which the alias makes unreachable anyway).
import '@astryxdesign/core/reset.css';
import '@astryxdesign/theme-neutral/theme.css';
import './index.css';

import {App} from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
