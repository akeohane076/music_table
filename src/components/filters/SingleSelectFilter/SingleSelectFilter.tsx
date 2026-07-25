import {useRef, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Popover, type PopoverProps} from '../../Popover/index.ts';
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

  // Configurability — every default stays exactly as the design specifies.
  /** Where the menu opens relative to the trigger. */
  readonly placement?: PopoverProps['placement'];
  readonly alignment?: PopoverProps['alignment'];
  /** StyleX overrides for the menu panel. */
  readonly menuXstyle?: stylex.StyleXStyles;
  /** Custom option content; the menuitemradio machinery is unchanged. */
  readonly renderOptionLabel?: (option: FilterOption<T>, state: {selected: boolean}) => ReactNode;
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
  placement,
  alignment,
  menuXstyle,
  renderOptionLabel,
}: SingleSelectFilterProps<T>) {
  const [selectedValue, setSelectedValue] = useControllableState<T | null>({value, defaultValue, onChange});
  const selected = options.find((option) => option.value === selectedValue) ?? null;
  const isActive = selected !== null;
  const triggerLabel = selected ? `${label}: ${selected.label}` : label;
  const menuRef = useRef<HTMLUListElement>(null);

  /** Arrow keys walk the menu items, wrapping at the ends — the WAI-ARIA menu pattern,
   * and the same interaction the multi-select's option list has. */
  function onMenuKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? index + 1 : index - 1;
    items[(next + items.length) % items.length]?.focus();
  }

  return (
    <Popover label={`${label} filter`} placement={placement} alignment={alignment}>
      <Popover.Trigger>
        {children ? (
          children({value: selectedValue, label: selected?.label ?? null, isActive})
        ) : (
          <FilterTrigger isActive={isActive}>{triggerLabel}</FilterTrigger>
        )}
      </Popover.Trigger>
      <Popover.Content>
        {({close}) => (
          <div {...stylex.props(styles.popover.card, styles.singleSelect.panel, menuXstyle)}>
            {/*
              A menu of radio items, not a listbox: each option applies immediately on click
              and the choices are mutually exclusive, which `menuitemradio` models exactly.
            */}
            <ul
              ref={menuRef}
              role="menu"
              aria-label={label}
              onKeyDown={onMenuKeyDown}
              {...stylex.props(styles.singleSelect.list)}
            >
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
                      {renderOptionLabel ? renderOptionLabel(option, {selected: isSelected}) : option.label}
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
