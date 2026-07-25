import {useMemo, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import type {Slot} from '../../../lib/slotProps.ts';
import {FilterPopover} from '../../Popover/index.ts';
import {SearchInput} from '../../SearchInput/index.ts';
import {Button} from '../../Button/index.ts';
import {IconButton} from '../../IconButton/index.ts';
import {CheckIcon, CloseIcon} from '../../Icon/index.ts';
import {styles} from '../../../theme/componentStyles.ts';
import {useControllableState} from '../../../hooks/useControllableState.ts';
import type {FilterOption} from '../types.ts';

export interface MultiSelectFilterProps<T extends string = string> {
  readonly label: string;
  readonly options: readonly FilterOption<T>[];
  /** Committed selection. The menu edits a draft copy until Apply. Controllable: omit and
   * pass `defaultValue` for uncontrolled use. */
  readonly value?: readonly T[];
  readonly defaultValue?: readonly T[];
  readonly onChange?: (value: readonly T[]) => void;
  readonly isSearchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly applyLabel?: string;
  readonly clearLabel?: string;
  readonly selectedLabel?: string;
  readonly emptyMessage?: string;
  /** Override the trigger text. Defaults to `Artist (2)`. */
  readonly formatTriggerLabel?: (label: string, count: number) => string;
  /** Spread onto the trigger pill. */
  readonly triggerProps?: Omit<Slot<'button'>, 'ref'>;
}

function defaultTriggerLabel(label: string, count: number) {
  return count > 0 ? `${label} (${count})` : label;
}

/**
 * Multi-select filter.
 *
 * The selection inside the menu is a *draft*: checking boxes changes nothing on the page
 * until Apply. Dismissing (Esc, outside click, or the trigger) throws the draft away, which
 * is what makes Apply meaningful. Clear All empties the draft rather than committing, so it
 * stays undoable by dismissing. The committed value is controllable; the draft is internal.
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
  triggerProps,
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

  return (
    <FilterPopover
      label={`${label} filter`}
      triggerLabel={formatTriggerLabel(label, committed.length)}
      isActive={committed.length > 0}
      triggerProps={triggerProps}
      // Seed the draft from the committed value each time the menu opens, so a discarded
      // edit never leaks into the next session. Seeding on the open transition (not an
      // effect keyed on value) means an external change to `value` while the menu is open
      // can't wipe an in-progress edit.
      onOpen={() => {
        setDraft(committed);
        setQuery('');
      }}
    >
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
                {visibleOptions.map((option) => {
                  const isChecked = draft.includes(option.value);
                  return (
                    <li key={option.value}>
                      <label {...stylex.props(styles.multiSelect.optionRow)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(option.value)}
                          {...stylex.props(styles.multiSelect.nativeCheckbox)}
                        />
                        <span
                          aria-hidden="true"
                          {...stylex.props(styles.multiSelect.box, isChecked && styles.multiSelect.boxChecked)}
                        >
                          <CheckIcon size={14} />
                        </span>
                        <span {...stylex.props(styles.multiSelect.optionText)}>{option.label}</span>
                      </label>
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
                  <li key={option.value} {...stylex.props(styles.multiSelect.selectedRow)}>
                    <IconButton
                      icon={<CloseIcon size="sm" />}
                      label={`Remove ${option.label}`}
                      variant="plain"
                      size="xs"
                      onClick={() => toggle(option.value)}
                    />
                    <span {...stylex.props(styles.multiSelect.optionText)}>{option.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div {...stylex.props(styles.multiSelect.footer)}>
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
          </div>
        </div>
      )}
    </FilterPopover>
  );
}
