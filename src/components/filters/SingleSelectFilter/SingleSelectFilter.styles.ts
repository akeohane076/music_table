import * as stylex from '@stylexjs/stylex';
import {color, font, size, space, text} from '../../../theme/tokens.stylex.ts';

export const singleSelect = stylex.create({
  panel: {
    // 12px top/bottom padding so the first and last options clear the menu edges,
    // matching the design's 120x144 menu (12 + 3x40 rows + 12). minWidth pins the
    // design's 120px floor while still growing for longer option labels.
    paddingBlock: space.md,
    minWidth: size.menuMinWidth,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    maxHeight: '320px',
    overflowY: 'auto',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: size.rowHeight,
    paddingInline: space.md,
    border: 'none',
    backgroundColor: {default: 'transparent', ':hover': color.pageBg},
    color: color.textPrimary,
    fontFamily: font.family,
    fontSize: text.menuItemSize,
    fontWeight: text.menuItemWeight,
    textAlign: 'start',
    cursor: 'pointer',
    outlineOffset: '-2px',
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
  },
  selected: {
    fontWeight: '500',
  },
});
