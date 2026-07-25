import {useMemo, useRef, useState, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Popover} from '../../Popover/index.ts';
import {FilterTrigger} from '../FilterTrigger/index.ts';
import {SearchInput} from '../../SearchInput/index.ts';
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
}: MultiSelectFilterProps<T>) {
  const [committed, setCommitted] = useControllableState<readonly T[]>({value, defaultValue, onChange});
  const [draft, setDraft] = useState<readonly T[]>(committed);
  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  const visibleOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((option) => option.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

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
          <div {...stylex.props(styles.popover.card, styles.multiSelect.panel)}>
            <div {...stylex.props(styles.multiSelect.columns)}>
              <div {...stylex.props(styles.multiSelect.column)}>
                {isSearchable && (
                  <div {...stylex.props(styles.multiSelect.header, styles.multiSelect.headerSearch)}>
                    <SearchInput
                      value={query}
                      onChange={setQuery}
                      placeholder={searchPlaceholder}
                      variant="plain"
                    />
                  </div>
                )}
                <ul ref={listRef} onKeyDown={onListKeyDown} {...stylex.props(styles.multiSelect.scroll)}>
                  {visibleOptions.length === 0 && (
                    <li {...stylex.props(styles.multiSelect.empty)}>{emptyMessage}</li>
                  )}
                  {visibleOptions.map((option) => (
                    <li key={option.value}>
                      <Checkbox
                        checked={draft.includes(option.value)}
                        onChange={() => toggle(option.value)}
                      >
                        {option.label}
                      </Checkbox>
                    </li>
                  ))}
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
                        {option.label}
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
