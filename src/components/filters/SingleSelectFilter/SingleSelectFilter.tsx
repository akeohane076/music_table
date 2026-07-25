import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Popover} from '../../Popover/index.ts';
import {FilterTrigger} from '../FilterTrigger/index.ts';
import {styles} from '../../../theme/componentStyles.ts';
import {useControllableState} from '../../../hooks/useControllableState.ts';
import type {FilterOption} from '../types.ts';

/** State handed to a custom trigger render-prop. */
export interface SingleSelectTriggerState {
  readonly value: string | null;
  readonly label: string | null;
  readonly isActive: boolean;
}

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
  /** Pass a trigger to render; omit for the default pill. Receives the current state. */
  readonly children?: (state: SingleSelectTriggerState) => ReactNode;
}

/**
 * Single-select filter — a thin assembly of `Popover` + a menu of `menuitemradio`s. Commits
 * immediately on click (a single choice has nothing to batch). Controllable, and the trigger
 * is composed: pass a render-prop child, or get the default `FilterTrigger`.
 */
export function SingleSelectFilter<T extends string = string>({
  label,
  options,
  value,
  defaultValue = null,
  onChange,
  isClearable = true,
  children,
}: SingleSelectFilterProps<T>) {
  const [selectedValue, setSelectedValue] = useControllableState<T | null>({value, defaultValue, onChange});
  const selected = options.find((option) => option.value === selectedValue) ?? null;
  const isActive = selected !== null;
  const triggerLabel = selected ? `${label}: ${selected.label}` : label;

  return (
    <Popover label={`${label} filter`}>
      <Popover.Trigger>
        {children ? (
          children({value: selectedValue, label: selected?.label ?? null, isActive})
        ) : (
          <FilterTrigger isActive={isActive}>{triggerLabel}</FilterTrigger>
        )}
      </Popover.Trigger>
      <Popover.Content>
        {({close}) => (
          <div {...stylex.props(styles.popover.card, styles.singleSelect.panel)}>
            {/*
              A menu of radio items, not a listbox: each option applies immediately on click
              and the choices are mutually exclusive, which `menuitemradio` models exactly.
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
      </Popover.Content>
    </Popover>
  );
}
