import * as stylex from '@stylexjs/stylex';
import {color, radius, shadow} from '../../theme/tokens.stylex.ts';

/**
 * The shared entrance every filter menu uses, so the single- and multi-select menus
 * read as one control. Kept here rather than in each filter so there is exactly one
 * motion curve to change.
 */
export const menuIn = stylex.keyframes({
  from: {opacity: 0, transform: 'translateY(-4px) scale(0.98)'},
  to: {opacity: 1, transform: 'translateY(0) scale(1)'},
});

/**
 * The flat white card treatment common to both filter menus — surface, radius, shadow,
 * and entrance. Each filter composes this with its own layout style (padding, width,
 * columns vs. list) via `stylex.props(menuCard.base, ownStyle)`.
 */
export const menuCard = stylex.create({
  base: {
    backgroundColor: color.surface,
    borderRadius: radius.control,
    boxShadow: shadow.popover,
    transformOrigin: 'top center',
    animationName: menuIn,
    animationDuration: '140ms',
    animationTimingFunction: 'cubic-bezier(0.2, 0, 0.2, 1)',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
});
