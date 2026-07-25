import * as stylex from '@stylexjs/stylex';
import {color, font, radius, size, space, text} from '../../theme/tokens.stylex.ts';

export const checkbox = stylex.create({
  // The clickable row: a real <label> wrapping the hidden input, the visual box, and text.
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    minHeight: size.rowHeight,
    paddingInline: space.md,
    cursor: 'pointer',
    backgroundColor: {default: 'transparent', ':hover': color.pageBg},
    // The native input is visually hidden; surface its focus on the whole row.
    outlineOffset: '-2px',
    outline: {default: 'none', ':focus-within': `2px solid ${color.accent}`},
  },
  // Visually hidden but real (keyboard, screen readers, form semantics all intact).
  input: {
    position: 'absolute',
    opacity: 0,
    width: size.checkbox,
    height: size.checkbox,
    margin: 0,
    cursor: 'pointer',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: size.checkbox,
    height: size.checkbox,
    borderRadius: radius.control,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: color.borderControl,
    backgroundColor: color.surface,
    color: 'transparent',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '120ms',
    '@media (prefers-reduced-motion: reduce)': {transitionDuration: '0ms'},
  },
  boxChecked: {
    backgroundColor: color.accent,
    borderColor: color.accent,
    color: color.onAccent,
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
