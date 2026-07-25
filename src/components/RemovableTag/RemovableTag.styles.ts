import * as stylex from '@stylexjs/stylex';
import {color, font, size, space, text} from '../../theme/tokens.stylex.ts';

/** Slides in from the side it was added on. */
const tagIn = stylex.keyframes({
  from: {opacity: 0, transform: 'translateX(-6px)'},
  to: {opacity: 1, transform: 'translateX(0)'},
});

export const removableTag = stylex.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    minHeight: size.rowHeight,
    paddingInline: space.md,
    animationName: tagIn,
    animationDuration: '120ms',
    animationTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': {animationName: 'none'},
  },
  label: {
    fontFamily: font.family,
    fontSize: text.optionSize,
    fontWeight: text.optionWeight,
    color: color.textPrimary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
