import * as stylex from '@stylexjs/stylex';
import {FilterPopover} from './FilterPopover.tsx';
import {menuCard} from './menuSurface.ts';
import {color, font, size, space, text} from '../../theme/tokens.stylex.ts';
import type {FilterOption} from './types.ts';

export interface SingleSelectFilterProps<T extends string = string> {
  /** Shown alone when nothing is picked, and as "Label: Value" once it is. */
  readonly label: string;
  readonly options: readonly FilterOption<T>[];
  readonly value: T | null;
  readonly onChange: (value: T | null) => void;
  /** Re-selecting the current option clears it. Set false to require a value. */
  readonly isClearable?: boolean;
}

const styles = stylex.create({
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
    backgroundColor: {
      default: 'transparent',
      ':hover': color.pageBg,
    },
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

/**
 * Required component #2. Unlike the multi-select this commits immediately on click —
 * that difference is in the design (no Apply button here) and is intentional: a single
 * choice has nothing to batch, so an Apply step would only add a click.
 */
export function SingleSelectFilter<T extends string = string>({
  label,
  options,
  value,
  onChange,
  isClearable = true,
}: SingleSelectFilterProps<T>) {
  const selected = options.find((option) => option.value === value) ?? null;

  return (
    <FilterPopover
      label={`${label} filter`}
      triggerLabel={selected ? `${label}: ${selected.label}` : label}
      isActive={selected !== null}
    >
      {({close}) => (
        <div {...stylex.props(menuCard.base, styles.panel)}>
          {/*
            A menu of radio items, not a listbox: each option applies immediately on
            click and the choices are mutually exclusive, which `menuitemradio` models
            exactly. It also keeps the option interactive without nesting a button inside
            an interactive `role="option"` (invalid ARIA / an axe `nested-interactive`).
          */}
          <ul role="menu" aria-label={label} {...stylex.props(styles.list)}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      // Re-selecting the active option clears it, unless required.
                      onChange(isSelected && isClearable ? null : option.value);
                      close();
                    }}
                    {...stylex.props(styles.option, isSelected && styles.selected)}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </FilterPopover>
  );
}
