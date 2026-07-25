import * as stylex from '@stylexjs/stylex';
import {color, space} from '../../theme/tokens.stylex.ts';

export const buttonBar = stylex.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    borderBlockStartWidth: '1px',
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: color.border,
  },
  start: {justifyContent: 'flex-start'},
  center: {justifyContent: 'center'},
  end: {justifyContent: 'flex-end'},
  between: {justifyContent: 'space-between'},
});
