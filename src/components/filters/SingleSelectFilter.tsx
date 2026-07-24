import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Popover} from '@astryxdesign/core/Popover';
import {FilterPill} from './FilterPill.tsx';
import {color, font, radius, shadow, size, space, text} from '../../theme/tokens.stylex.ts';
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

/** Matches the multi-select's entrance so both filters feel like one control. */
const panelIn = stylex.keyframes({
  from: {opacity: 0, transform: 'translateY(-4px) scale(0.98)'},
  to: {opacity: 1, transform: 'translateY(0) scale(1)'},
});

const styles = stylex.create({
  /** Reduce Astryx's themed dialog to a positioning shell — see MultiSelectFilter. */
  popoverSurface: {
    width: 'auto',
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: radius.control,
    boxShadow: 'none',
    borderWidth: 0,
  },
  panel: {
    // 12px top/bottom padding so the first and last options clear the menu edges,
    // matching the design's 120x144 menu (12 + 3x40 rows + 12). minWidth pins the
    // design's 120px floor while still growing for longer option labels.
    paddingBlock: space.md,
    minWidth: size.menuMinWidth,
    backgroundColor: color.surface,
    borderRadius: radius.control,
    boxShadow: shadow.popover,
    transformOrigin: 'top center',
    animationName: panelIn,
    animationDuration: '140ms',
    animationTimingFunction: 'cubic-bezier(0.2, 0, 0.2, 1)',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
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
    fontSize: text.optionSize,
    fontWeight: text.optionWeight,
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
 * that difference is in the design (no Apply button here) and is intentional: a
 * single choice has nothing to batch, so an Apply step would just add a click.
 */
export function SingleSelectFilter<T extends string = string>({
  label,
  options,
  value,
  onChange,
  isClearable = true,
}: SingleSelectFilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? null;

  function select(option: FilterOption<T>) {
    const isSame = option.value === value;
    onChange(isSame && isClearable ? null : option.value);
    setIsOpen(false);
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="below"
      alignment="start"
      label={`${label} filter`}
      xstyle={styles.popoverSurface}
      content={
        <div {...stylex.props(styles.panel)}>
          <ul role="listbox" aria-label={label} {...stylex.props(styles.list)}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => select(option)}
                    {...stylex.props(styles.option, isSelected && styles.selected)}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      }
    >
      {(triggerProps) => (
        <FilterPill
          {...triggerProps}
          label={selected ? `${label}: ${selected.label}` : label}
          isOpen={isOpen}
          isActive={selected !== null}
        />
      )}
    </Popover>
  );
}
