import * as stylex from '@stylexjs/stylex';
import {color, font, space, text} from '../../theme/tokens.stylex.ts';

export const pagination = stylex.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: space.sm,
    paddingBlockStart: space.md,
  },
  label: {
    fontFamily: font.family,
    fontSize: text.paginationSize,
    lineHeight: text.paginationLine,
    fontWeight: text.paginationWeight,
    color: color.textPrimary,
    minWidth: '52px',
    textAlign: 'center',
  },
});
