import * as stylex from '@stylexjs/stylex';
import {color, font, size, space, text} from '../../../theme/tokens.stylex.ts';

/**
 * Layout only. The option rows, selected chips, and footer are now `Checkbox`,
 * `RemovableTag`, and `ButtonBar`; this file keeps just the menu's two-column frame.
 */
export const multiSelect = stylex.create({
  // Composed with popover.card; `overflow: hidden` clips the columns to the card radius.
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
  empty: {
    padding: space.md,
    fontFamily: font.family,
    fontSize: text.optionSize,
    color: color.textMuted,
  },
  // Apply/Clear are 65px min-width in the design; nudge the Button primitive to match.
  footerButton: {
    minWidth: '65px',
  },
});
