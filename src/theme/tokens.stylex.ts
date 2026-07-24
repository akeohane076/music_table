// Design tokens extracted directly from the Figma file via scripts/extract-figma-tokens.mjs.
// Every value here is a measured value from the design, not an approximation — if the design
// changes, re-run `npm run tokens` and update this file rather than patching components.

import * as stylex from '@stylexjs/stylex';

export const color = stylex.defineVars({
  /** Page background behind the card. */
  pageBg: '#F5F5F5',
  /** Card, filter buttons, popover, search field. */
  surface: '#FFFFFF',

  /** Body copy, column headers, option labels, active sort arrow. */
  textPrimary: '#212121',
  /** Placeholder text in both search fields. */
  textMuted: '#757575',

  /** Table row rules, popover dividers. */
  border: '#E0E0E0',
  /** Focused search field and active filter button outline. */
  borderStrong: '#212121',
  /** Unchecked checkbox outline. */
  borderControl: '#757575',

  /** Inactive sort arrows and pagination chevrons. */
  iconMuted: '#BDBDBD',
  /** Search glyph. */
  iconStrong: '#000000',

  /** Apply button fill, checked checkbox fill, Clear All outline + label. */
  accent: '#006088',
  /** Text/glyph sitting on `accent`. */
  onAccent: '#FFFFFF',
});

export const font = stylex.defineVars({
  family: "'Roboto', system-ui, -apple-system, sans-serif",
});

// Each token is `weight size/lineHeight`, matching what the Figma reported.
export const text = stylex.defineVars({
  pageTitleSize: '24px',
  pageTitleLine: '28px',
  pageTitleWeight: '500',

  columnHeaderSize: '16px',
  columnHeaderLine: '19px',
  columnHeaderWeight: '500',

  cellSize: '14px',
  cellLine: '40px',
  cellWeight: '400',

  /** Filter button labels and the Clear All / Apply buttons. */
  controlLabelSize: '12px',
  controlLabelLine: '16px',
  controlLabelWeight: '600',

  /** Search field value + placeholder. */
  inputSize: '16px',
  inputLine: '20px',
  inputWeight: '400',

  /** Multi-select checkbox options and selected-item rows. */
  optionSize: '16px',
  optionLine: '40px',
  optionWeight: '400',

  /** Single-select menu items — 14px in the design, distinct from the 16px
   * multi-select options, and matching the table's own row text. */
  menuItemSize: '14px',
  menuItemWeight: '400',

  selectedHeaderSize: '16px',
  selectedHeaderLine: '36px',
  selectedHeaderWeight: '500',

  paginationSize: '14px',
  paginationLine: '20px',
  paginationWeight: '400',
});

export const radius = stylex.defineVars({
  /** The results card. */
  card: '12px',
  /** Search field, popover, buttons, checkbox. */
  control: '4px',
  /** Filter buttons — fully rounded at 40px tall. */
  pill: '20px',
});

export const shadow = stylex.defineVars({
  popover: '0 0 16px 0 rgba(0, 0, 0, 0.20)',
});

export const space = stylex.defineVars({
  xs: '4px',
  sm: '8px',
  /** The popover's padding grid and the gap between footer buttons. */
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '40px',
});

export const size = stylex.defineVars({
  /** Design canvas width; the card is 1232 inside 24px gutters. */
  pageWidth: '1280px',
  cardWidth: '1232px',
  /** Search field and filter buttons are both 40px tall. */
  controlHeight: '40px',
  /** Table rows and popover option rows share this rhythm. */
  rowHeight: '40px',
  searchWidth: '300px',
  popoverWidth: '500px',
  popoverColumn: '250px',
  /** Single-select menu width in the design. A minimum, not a cap, so longer
   * option labels than the genre facet's still grow the menu rather than truncate. */
  menuMinWidth: '120px',
  checkbox: '16px',
  icon: '20px',
  smallIcon: '16px',
});
