import * as stylex from '@stylexjs/stylex';

export const icon = stylex.create({
  // Icons inherit color from their context (currentColor) and never shrink in a flex row.
  base: {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
});
