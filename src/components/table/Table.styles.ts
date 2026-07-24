import * as stylex from '@stylexjs/stylex';
import {color, font, space, text} from '../../theme/tokens.stylex.ts';

export const table = stylex.create({
  scroller: {
    overflowX: 'auto',
  },
  root: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: font.family,
  },
  headerCell: {
    height: space.xxl,
    paddingInline: 0,
    textAlign: 'start',
    verticalAlign: 'middle',
    fontSize: text.columnHeaderSize,
    lineHeight: text.columnHeaderLine,
    fontWeight: text.columnHeaderWeight,
    color: color.textPrimary,
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: color.border,
    whiteSpace: 'nowrap',
  },
  cell: {
    height: space.xxl,
    paddingInline: 0,
    verticalAlign: 'middle',
    fontSize: text.cellSize,
    fontWeight: text.cellWeight,
    color: color.textPrimary,
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: color.border,
  },
  alignEnd: {textAlign: 'end'},
  alignCenter: {textAlign: 'center'},

  // Neutralises the Button primitive's own geometry so a sortable header reads as header
  // text (16/500) with a 4px gap to the arrow, no button chrome or hover fill.
  sortTrigger: {
    height: 'auto',
    paddingInline: 0,
    // The Button primitive keeps a 1px transparent border for layout-stable variants; a
    // header isn't a variant, so drop it — otherwise it offsets the label/arrow by 1px.
    borderWidth: 0,
    gap: space.xs,
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
    backgroundColor: {default: 'transparent', ':hover': 'transparent'},
  },
  // Inactive columns keep the arrow at the muted grey the design uses.
  sortArrow: {
    color: color.iconMuted,
    transitionProperty: 'transform, color',
    transitionDuration: '150ms',
    '@media (prefers-reduced-motion: reduce)': {transitionDuration: '0ms'},
  },
  sortArrowActive: {
    color: color.textPrimary,
  },
  sortArrowDesc: {
    transform: 'scaleY(-1)',
  },
  empty: {
    height: '160px',
    textAlign: 'center',
    fontSize: text.optionSize,
    color: color.textMuted,
  },
});
