import * as stylex from '@stylexjs/stylex';
import {color, radius} from '../../theme/tokens.stylex.ts';

/** Square icon-only button. Size sets the hit area; the caller sizes the glyph inside. */
export const iconButton = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: radius.control,
    backgroundColor: 'transparent',
    cursor: {default: 'pointer', ':disabled': 'not-allowed'},
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
    outlineOffset: '2px',
  },

  // Hit-area squares.
  xs: {width: '16px', height: '16px'},
  sm: {width: '20px', height: '20px'},
  md: {width: '24px', height: '24px'},
  lg: {width: '32px', height: '32px'},

  // Variants.
  // Pagination arrows: muted when disabled, accent on hover when live.
  ghost: {
    color: {default: color.textPrimary, ':hover': color.accent, ':disabled': color.iconMuted},
  },
  // Search clear: a faint hover fill.
  subtle: {
    color: color.textPrimary,
    backgroundColor: {default: 'transparent', ':hover': color.pageBg},
  },
  // The multi-select's remove-× : plain, no hover fill.
  plain: {
    color: color.textPrimary,
  },
});
