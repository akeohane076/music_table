import * as stylex from '@stylexjs/stylex';
import {color, radius, shadow} from '../../theme/tokens.stylex.ts';

/** Shared entrance for every filter menu, so all menus read as one control. */
const menuIn = stylex.keyframes({
  from: {opacity: 0, transform: 'translateY(-4px) scale(0.98)'},
  to: {opacity: 1, transform: 'translateY(0) scale(1)'},
});

export const popover = stylex.create({
  // Astryx's Popover ships a dark themed surface with a 12px radius. Reduce it to a bare
  // positioning shell so each menu supplies its own flat white 4px card, while the popover
  // keeps doing the work worth inheriting: anchoring, focus, and dismissal.
  surface: {
    width: 'auto',
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: radius.control,
    boxShadow: 'none',
    borderWidth: 0,
  },
  // The flat white card treatment both filter menus compose with their own layout.
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.control,
    boxShadow: shadow.popover,
    transformOrigin: 'top center',
    animationName: menuIn,
    animationDuration: '140ms',
    animationTimingFunction: 'cubic-bezier(0.2, 0, 0.2, 1)',
    '@media (prefers-reduced-motion: reduce)': {animationName: 'none'},
  },
  // The pill trigger's caret, rotated when the menu is open.
  caret: {
    transitionProperty: 'transform',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',
    '@media (prefers-reduced-motion: reduce)': {transitionDuration: '0ms'},
  },
  caretOpen: {
    transform: 'rotate(180deg)',
  },
});
