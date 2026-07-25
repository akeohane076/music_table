import * as stylex from '@stylexjs/stylex';
import {FilterPopover} from '../../Popover/index.ts';
import {styles} from '../../../theme/componentStyles.ts';
import {useControllableState} from '../../../hooks/useControllableState.ts';
import type {Slot} from '../../../lib/slotProps.ts';
import type {FilterOption} from '../types.ts';

export interface SingleSelectFilterProps<T extends string = string> {
  /** Shown alone when nothing is picked, and as "Label: Value" once it is. */
  readonly label: string;
  readonly options: readonly FilterOption<T>[];
  /** Controlled selection. Omit and pass `defaultValue` for uncontrolled use. */
  readonly value?: T | null;
  readonly defaultValue?: T | null;
  readonly onChange?: (value: T | null) => void;
  /** Re-selecting the current option clears it. Set false to require a value. */
  readonly isClearable?: boolean;
  /** Spread onto the trigger pill. */
  readonly triggerProps?: Omit<Slot<'button'>, 'ref'>;
}

/**
 * Single-select filter. Unlike the multi-select this commits immediately on click — that
 * difference is in the design (no Apply button here) and is intentional: a single choice
 * has nothing to batch. Controllable: pass `value` to drive it externally, or `defaultValue`
 * to let it own its state.
 */
export function SingleSelectFilter<T extends string = string>({
  label,
  options,
  value,
  defaultValue = null,
  onChange,
  isClearable = true,
  triggerProps,
}: SingleSelectFilterProps<T>) {
  const [selectedValue, setSelectedValue] = useControllableState<T | null>({
    value,
    defaultValue,
    onChange,
  });
  const selected = options.find((option) => option.value === selectedValue) ?? null;

  return (
    <FilterPopover
      label={`${label} filter`}
      triggerLabel={selected ? `${label}: ${selected.label}` : label}
      isActive={selected !== null}
      triggerProps={triggerProps}
    >
      {({close}) => (
        <div {...stylex.props(styles.popover.card, styles.singleSelect.panel)}>
          {/*
            A menu of radio items, not a listbox: each option applies immediately on click
            and the choices are mutually exclusive, which `menuitemradio` models exactly. It
            also keeps the option interactive without nesting a button inside an interactive
            `role="option"` (invalid ARIA / an axe `nested-interactive`).
          */}
          <ul role="menu" aria-label={label} {...stylex.props(styles.singleSelect.list)}>
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <li key={option.value} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedValue(isSelected && isClearable ? null : option.value);
                      close();
                    }}
                    {...stylex.props(styles.singleSelect.option, isSelected && styles.singleSelect.selected)}
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
