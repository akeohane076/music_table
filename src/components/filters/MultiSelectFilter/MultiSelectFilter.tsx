import {useMemo, useRef, useState, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Popover, type PopoverProps} from '../../Popover/index.ts';
import {FilterTrigger} from '../FilterTrigger/index.ts';
import {SearchInput, type SearchInputProps} from '../../SearchInput/index.ts';
import {Button} from '../../Button/index.ts';
import {Checkbox} from '../../Checkbox/index.ts';
import {RemovableTag} from '../../RemovableTag/index.ts';
import {ButtonBar} from '../../ButtonBar/index.ts';
import {styles} from '../../../theme/componentStyles.ts';
import {useControllableState} from '../../../hooks/useControllableState.ts';
import type {FilterOption} from '../types.ts';

/** State handed to a custom trigger render-prop. */
export interface MultiSelectTriggerState {
  readonly count: number;
  readonly isActive: boolean;
}

export interface MultiSelectFilterProps<T extends string = string> {
  readonly label: string;
  readonly options: readonly FilterOption<T>[];
  /** Committed selection. The menu edits a draft copy until Apply. Controllable. */
  readonly value?: readonly T[];
  readonly defaultValue?: readonly T[];
  readonly onChange?: (value: readonly T[]) => void;
  readonly isSearchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly applyLabel?: string;
  readonly clearLabel?: string;
  readonly selectedLabel?: string;
  readonly emptyMessage?: string;
  /** Formats the default trigger's text. Ignored when a trigger child is provided. */
  readonly formatTriggerLabel?: (label: string, count: number) => string;
  /** Pass a trigger to render; omit for the default pill. Receives `{count, isActive}`. */
  readonly children?: (state: MultiSelectTriggerState) => ReactNode;

  // Configurability — every default stays exactly as the design specifies.
  /** Where the menu opens relative to the trigger. */
  readonly placement?: PopoverProps['placement'];
  readonly alignment?: PopoverProps['alignment'];
  /** StyleX overrides for the menu panel. */
  readonly menuXstyle?: stylex.StyleXStyles;
  /** Forwarded to the in-menu search — placeholder, slots, etc. Its value/onChange stay
   * owned by the filter (the guardrail), so the search always drives option filtering. */
  readonly searchProps?: Omit<SearchInputProps, 'value' | 'defaultValue' | 'onChange'>;
  /** How the in-menu search matches options. Default: case-insensitive label substring. */
  readonly filterOption?: (option: FilterOption<T>, query: string) => boolean;
  /** Custom option-row content (e.g. a swatch or count). The row's checkbox machinery —
   * toggling, roles, keyboard — is unchanged; only the label content is yours. */
  readonly renderOptionLabel?: (option: FilterOption<T>, state: {checked: boolean}) => ReactNode;
  /** Custom content for a selected item in the right-hand column. */
  readonly renderSelectedLabel?: (option: FilterOption<T>) => ReactNode;
}

function defaultTriggerLabel(label: string, count: number) {
  return count > 0 ? `${label} (${count})` : label;
}

/**
 * Multi-select filter — a thin assembly of `Popover`, `Checkbox` (options), `RemovableTag`
 * (selected), `ButtonBar` (footer), and `SearchInput`. The trigger is composed too.
 *
 * The selection inside the menu is a *draft*: checking boxes changes nothing until Apply.
 * Dismissing discards it; Clear All empties the draft without committing. The committed value
 * is controllable; the draft is internal.
 */
export function MultiSelectFilter<T extends string = string>({
  label,
  options,
  value,
  defaultValue = [],
  onChange,
  isSearchable = true,
  searchPlaceholder = `Search ${label}s`,
  applyLabel = 'Apply',
  clearLabel = 'Clear All',
  selectedLabel = 'Selected',
  emptyMessage = 'No matches',
  formatTriggerLabel = defaultTriggerLabel,
  children,
  placement,
  alignment,
  menuXstyle,
  searchProps,
  filterOption = (option, q) => option.label.toLowerCase().includes(q),
  renderOptionLabel,
  renderSelectedLabel,
}: MultiSelectFilterProps<T>) {
  const [committed, setCommitted] = useControllableState<readonly T[]>({value, defaultValue, onChange});
  const [draft, setDraft] = useState<readonly T[]>(committed);
  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  const visibleOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((option) => filterOption(option, q)) : options;
  }, [options, query, filterOption]);

  const selectedOptions = useMemo(
    () => options.filter((option) => draft.includes(option.value)),
    [options, draft],
  );

  function toggle(optionValue: T) {
    setDraft((current) =>
      current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue],
    );
  }

  /** Arrow keys walk the option list; the checkboxes themselves stay in the tab order. */
  function onListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const inputs = Array.from(listRef.current?.querySelectorAll<HTMLInputElement>('input') ?? []);
    const index = inputs.indexOf(document.activeElement as HTMLInputElement);
    if (index === -1) return;
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? index + 1 : index - 1;
    inputs[(next + inputs.length) % inputs.length]?.focus();
  }

  const count = committed.length;
  const isActive = count > 0;

  return (
    <Popover
      label={`${label} filter`}
      placement={placement}
      alignment={alignment}
      // Seed the draft from the committed value each time the menu opens, so a discarded
      // edit never leaks into the next session, and an external change to `value` while the
      // menu is open can't wipe an in-progress edit.
      onOpen={() => {
        setDraft(committed);
        setQuery('');
      }}
    >
      <Popover.Trigger>
        {children ? (
          children({count, isActive})
        ) : (
          <FilterTrigger isActive={isActive}>{formatTriggerLabel(label, count)}</FilterTrigger>
        )}
      </Popover.Trigger>
      <Popover.Content>
        {({close}) => (
          <div {...stylex.props(styles.popover.card, styles.multiSelect.panel, menuXstyle)}>
            <div {...stylex.props(styles.multiSelect.columns)}>
              <div {...stylex.props(styles.multiSelect.column)}>
                {isSearchable && (
                  <div {...stylex.props(styles.multiSelect.header, styles.multiSelect.headerSearch)}>
                    <SearchInput
                      placeholder={searchPlaceholder}
                      variant="plain"
                      {...searchProps}
                      // Guardrail after the slot spread: the search always drives filtering.
                      value={query}
                      onChange={setQuery}
                    />
                  </div>
                )}
                <ul ref={listRef} onKeyDown={onListKeyDown} {...stylex.props(styles.multiSelect.scroll)}>
                  {visibleOptions.length === 0 && (
                    <li {...stylex.props(styles.multiSelect.empty)}>{emptyMessage}</li>
                  )}
                  {visibleOptions.map((option) => {
                    const checked = draft.includes(option.value);
                    return (
                      <li key={option.value}>
                        <Checkbox checked={checked} onChange={() => toggle(option.value)}>
                          {renderOptionLabel ? renderOptionLabel(option, {checked}) : option.label}
                        </Checkbox>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div {...stylex.props(styles.multiSelect.column, styles.multiSelect.columnDivided)}>
                <div {...stylex.props(styles.multiSelect.header)}>
                  <h2 {...stylex.props(styles.multiSelect.selectedHeading)}>
                    {selectedLabel} ({selectedOptions.length})
                  </h2>
                </div>
                <ul {...stylex.props(styles.multiSelect.scroll)}>
                  {selectedOptions.map((option) => (
                    <li key={option.value}>
                      <RemovableTag onRemove={() => toggle(option.value)} removeLabel={`Remove ${option.label}`}>
                        {renderSelectedLabel ? renderSelectedLabel(option) : option.label}
                      </RemovableTag>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ButtonBar>
              <Button
                variant="outline"
                size="sm"
                xstyle={styles.multiSelect.footerButton}
                onClick={() => setDraft([])}
              >
                {clearLabel}
              </Button>
              <Button
                variant="solid"
                size="sm"
                xstyle={styles.multiSelect.footerButton}
                onClick={() => {
                  setCommitted(draft);
                  close();
                }}
              >
                {applyLabel}
              </Button>
            </ButtonBar>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
