import {useMemo, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {FilterPopover} from './FilterPopover.tsx';
import {menuCard} from './menuSurface.ts';
import {SearchInput} from './SearchInput.tsx';
import {CheckIcon, CloseIcon} from '../icons.tsx';
import {color, font, radius, size, space, text} from '../../theme/tokens.stylex.ts';
import type {FilterOption} from './types.ts';

export interface MultiSelectFilterProps<T extends string = string> {
  readonly label: string;
  readonly options: readonly FilterOption<T>[];
  /** Committed selection. The popover edits a draft copy until Apply. */
  readonly value: readonly T[];
  readonly onChange: (value: readonly T[]) => void;
  readonly isSearchable?: boolean;
  readonly searchPlaceholder?: string;
  readonly applyLabel?: string;
  readonly clearLabel?: string;
  readonly selectedLabel?: string;
  readonly emptyMessage?: string;
  /** Override the trigger text. Defaults to `Artist (2)`. */
  readonly formatTriggerLabel?: (label: string, count: number) => string;
}

/** Selected chips slide in from the column they were checked in. */
const chipIn = stylex.keyframes({
  from: {opacity: 0, transform: 'translateX(-6px)'},
  to: {opacity: 1, transform: 'translateX(0)'},
});

const styles = stylex.create({
  // The shared card treatment (surface, radius, shadow, entrance) comes from
  // menuCard.base; this adds only the multi-select's own layout. `overflow: hidden`
  // clips the columns to the card radius so the divider and rows never poke past it.
  panel: {
    display: 'flex',
    flexDirection: 'column',
    width: size.popoverWidth,
    maxWidth: 'calc(100vw - 32px)',
    overflow: 'hidden',
  },
  columns: {
    display: 'grid',
    // Two equal columns split by a rule at the midpoint. The design fixes the body at
    // 295px regardless of option count. gridTemplateRows pins the row to that height —
    // a bare `height` leaves the implicit row auto-sized, so the columns grow to fit
    // their content and the list never clips or scrolls.
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '295px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    // Grid items default to min-height:auto, which refuses to shrink below content.
    // Without this the column outgrows its 295px row and the list can't scroll.
    minHeight: 0,
  },
  columnDivided: {
    borderInlineStartWidth: '1px',
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: color.border,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    paddingInline: space.md,
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: color.border,
  },
  /** The nested search carries its own 12px icon inset, so the row adds none. */
  headerSearch: {
    paddingInline: 0,
  },
  selectedHeading: {
    margin: 0,
    fontFamily: font.family,
    fontSize: text.selectedHeaderSize,
    lineHeight: text.selectedHeaderLine,
    fontWeight: text.selectedHeaderWeight,
    color: color.textPrimary,
  },
  scroll: {
    flex: 1,
    // Same min-height:0 story as the column: a flex item won't shrink below its
    // content by default, so overflow-y:auto never engages without this.
    minHeight: 0,
    overflowY: 'auto',
    paddingBlock: space.md,
    listStyle: 'none',
    margin: 0,
    paddingInline: 0,
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    height: size.rowHeight,
    paddingInline: space.md,
    cursor: 'pointer',
    backgroundColor: {default: 'transparent', ':hover': color.pageBg},
  },
  optionText: {
    fontFamily: font.family,
    fontSize: text.optionSize,
    fontWeight: text.optionWeight,
    color: color.textPrimary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nativeCheckbox: {
    position: 'absolute',
    opacity: 0,
    width: '16px',
    height: '16px',
    margin: 0,
    cursor: 'pointer',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: size.checkbox,
    height: size.checkbox,
    borderRadius: radius.control,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: color.borderControl,
    backgroundColor: color.surface,
    color: 'transparent',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '120ms',
    '@media (prefers-reduced-motion: reduce)': {transitionDuration: '0ms'},
  },
  boxChecked: {
    backgroundColor: color.accent,
    borderColor: color.accent,
    color: color.onAccent,
  },
  boxFocused: {
    outline: `2px solid ${color.accent}`,
    outlineOffset: '2px',
  },
  selectedRow: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    height: size.rowHeight,
    paddingInline: space.md,
    animationName: chipIn,
    animationDuration: '120ms',
    animationTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': {
      animationName: 'none',
    },
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: size.smallIcon,
    height: size.smallIcon,
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    color: color.textPrimary,
    cursor: 'pointer',
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
    outlineOffset: '2px',
  },
  empty: {
    padding: space.md,
    fontFamily: font.family,
    fontSize: text.optionSize,
    color: color.textMuted,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: space.md,
    padding: space.md,
    borderBlockStartWidth: '1px',
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: color.border,
  },
  button: {
    minWidth: '65px',
    height: '24px',
    paddingInline: space.md,
    borderRadius: radius.control,
    borderWidth: '1px',
    borderStyle: 'solid',
    fontFamily: font.family,
    fontSize: text.controlLabelSize,
    lineHeight: text.controlLabelLine,
    fontWeight: text.controlLabelWeight,
    cursor: 'pointer',
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
    outlineOffset: '2px',
  },
  secondary: {
    backgroundColor: {default: color.surface, ':hover': color.pageBg},
    borderColor: color.accent,
    color: color.accent,
  },
  primary: {
    backgroundColor: color.accent,
    borderColor: color.accent,
    color: color.onAccent,
  },
});

function defaultTriggerLabel(label: string, count: number) {
  return count > 0 ? `${label} (${count})` : label;
}

/**
 * Required component #3.
 *
 * The selection inside the popover is a *draft*: checking boxes changes nothing on the
 * page until Apply. Dismissing the popover (Esc, outside click, or the trigger) throws
 * the draft away, which is what makes Apply meaningful — without a discard path there
 * would be nothing to apply. Clear All empties the draft rather than committing, so it
 * stays undoable by dismissing, consistent with every other control in the panel.
 */
export function MultiSelectFilter<T extends string = string>({
  label,
  options,
  value,
  onChange,
  isSearchable = true,
  searchPlaceholder = `Search ${label}s`,
  applyLabel = 'Apply',
  clearLabel = 'Clear All',
  selectedLabel = 'Selected',
  emptyMessage = 'No matches',
  formatTriggerLabel = defaultTriggerLabel,
}: MultiSelectFilterProps<T>) {
  const [draft, setDraft] = useState<readonly T[]>(value);
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
      triggerLabel={formatTriggerLabel(label, value.length)}
      isActive={value.length > 0}
      // Seed the draft from the committed value each time the menu opens, so a
      // discarded edit never leaks into the next session. Seeding here (on the
      // open transition) rather than in an effect means an external change to
      // `value` while the menu is open can't wipe an in-progress edit.
      onOpen={() => {
        setDraft(value);
        setQuery('');
      }}
    >
      {({close}) => (
        <div {...stylex.props(menuCard.base, styles.panel)}>
          <div {...stylex.props(styles.columns)}>
            <div {...stylex.props(styles.column)}>
              {isSearchable && (
                <div {...stylex.props(styles.header, styles.headerSearch)}>
                  <SearchInput
                    value={query}
                    onChange={setQuery}
                    placeholder={searchPlaceholder}
                    variant="plain"
                  />
                </div>
              )}
              <ul ref={listRef} onKeyDown={onListKeyDown} {...stylex.props(styles.scroll)}>
                {visibleOptions.length === 0 && <li {...stylex.props(styles.empty)}>{emptyMessage}</li>}
                {visibleOptions.map((option) => {
                  const isChecked = draft.includes(option.value);
                  return (
                    <li key={option.value}>
                      <label {...stylex.props(styles.optionRow)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(option.value)}
                          {...stylex.props(styles.nativeCheckbox)}
                        />
                        <span aria-hidden="true" {...stylex.props(styles.box, isChecked && styles.boxChecked)}>
                          <CheckIcon size={14} />
                        </span>
                        <span {...stylex.props(styles.optionText)}>{option.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div {...stylex.props(styles.column, styles.columnDivided)}>
              <div {...stylex.props(styles.header)}>
                <h2 {...stylex.props(styles.selectedHeading)}>
                  {selectedLabel} ({selectedOptions.length})
                </h2>
              </div>
              <ul {...stylex.props(styles.scroll)}>
                {selectedOptions.map((option) => (
                  <li key={option.value} {...stylex.props(styles.selectedRow)}>
                    <button
                      type="button"
                      onClick={() => toggle(option.value)}
                      aria-label={`Remove ${option.label}`}
                      {...stylex.props(styles.removeButton)}
                    >
                      <CloseIcon size={16} />
                    </button>
                    <span {...stylex.props(styles.optionText)}>{option.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div {...stylex.props(styles.footer)}>
            <button type="button" onClick={() => setDraft([])} {...stylex.props(styles.button, styles.secondary)}>
              {clearLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(draft);
                close();
              }}
              {...stylex.props(styles.button, styles.primary)}
            >
              {applyLabel}
            </button>
          </div>
        </div>
      )}
    </FilterPopover>
  );
}
