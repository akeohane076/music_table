// Central component-style registry.
//
// Each component defines its StyleX styles in a colocated `Component.styles.ts` (which
// reads design tokens from `tokens.stylex.ts`); this file rolls them all up into one
// `styles` object. Components reference their styles through it — `styles.button.root`,
// `styles.table.cell` — so the whole system's styling is visible, and overridable, in one
// place. Trade-off: importing any component pulls this map, so styles aren't tree-shaken
// per component; acceptable at this scale, and later mitigable with subpath exports.

import {icon} from '../components/Icon/Icon.styles.ts';
import {button} from '../components/Button/Button.styles.ts';
import {iconButton} from '../components/IconButton/IconButton.styles.ts';
import {input} from '../components/Input/Input.styles.ts';
import {popover} from '../components/Popover/Popover.styles.ts';
import {table} from '../components/Table/Table.styles.ts';
import {pagination} from '../components/Pagination/Pagination.styles.ts';
import {singleSelect} from '../components/filters/SingleSelectFilter/SingleSelectFilter.styles.ts';
import {multiSelect} from '../components/filters/MultiSelectFilter/MultiSelectFilter.styles.ts';

export const styles = {
  icon,
  button,
  iconButton,
  input,
  popover,
  table,
  pagination,
  singleSelect,
  multiSelect,
} as const;
