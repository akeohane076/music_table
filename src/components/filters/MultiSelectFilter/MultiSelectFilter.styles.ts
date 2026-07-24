import * as stylex from '@stylexjs/stylex';
import {color, font, radius, size, space, text} from '../../../theme/tokens.stylex.ts';

/** Selected chips slide in from the column they were checked in. */
const chipIn = stylex.keyframes({
  from: {opacity: 0, transform: 'translateX(-6px)'},
  to: {opacity: 1, transform: 'translateX(0)'},
});

export const multiSelect = stylex.create({
  // Composed with popover.card; adds only the multi-select's own layout. `overflow: hidden`
  // clips the columns to the card radius so the divider and rows never poke past it.
  panel: {
    display: 'flex',
    flexDirection: 'column',
    width: size.popoverWidth,
    maxWidth: 'calc(100vw - 32px)',
    overflow: 'hidden',
  },
  columns: {
    display: 'grid',
    // Two equal columns split by a rule at the midpoint. gridTemplateRows pins the body to
    // 295px — a bare height leaves the implicit row auto-sized, so the list can't scroll.
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '295px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    // Grid/flex items default to min-height:auto and refuse to shrink below content;
    // without this the column outgrows its row and the list can't scroll.
    minHeight: 0,
  },
  columnDivided: {
    borderInlineStartWidth: '1px',
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: color.border,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    paddingInline: space.md,
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: color.border,
  },
  /** The nested search carries its own 12px icon inset, so the row adds none. */
  headerSearch: {
    paddingInline: 0,
  },
  selectedHeading: {
    margin: 0,
    fontFamily: font.family,
    fontSize: text.selectedHeaderSize,
    lineHeight: text.selectedHeaderLine,
    fontWeight: text.selectedHeaderWeight,
    color: color.textPrimary,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingBlock: space.md,
    listStyle: 'none',
    margin: 0,
    paddingInline: 0,
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    height: size.rowHeight,
    paddingInline: space.md,
    cursor: 'pointer',
    backgroundColor: {default: 'transparent', ':hover': color.pageBg},
    // The native checkbox is visually hidden; show its focus on the whole row.
    outlineOffset: '-2px',
    outline: {default: 'none', ':focus-within': `2px solid ${color.accent}`},
  },
  optionText: {
    fontFamily: font.family,
    fontSize: text.optionSize,
    fontWeight: text.optionWeight,
    color: color.textPrimary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nativeCheckbox: {
    position: 'absolute',
    opacity: 0,
    width: '16px',
    height: '16px',
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
  selectedRow: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    height: size.rowHeight,
    paddingInline: space.md,
    animationName: chipIn,
    animationDuration: '120ms',
    animationTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': {animationName: 'none'},
  },
  empty: {
    padding: space.md,
    fontFamily: font.family,
    fontSize: text.optionSize,
    color: color.textMuted,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: space.md,
    padding: space.md,
    borderBlockStartWidth: '1px',
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: color.border,
  },
  // Apply/Clear are 65px min-width in the design; nudge the Button primitive to match.
  footerButton: {
    minWidth: '65px',
  },
});
