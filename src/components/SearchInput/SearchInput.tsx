import * as stylex from '@stylexjs/stylex';
import {Input, type InputVariant} from '../Input/index.ts';
import {IconButton, type IconButtonProps} from '../IconButton/index.ts';
import {CloseIcon, SearchIcon} from '../Icon/index.ts';
import {useControllableState} from '../../hooks/useControllableState.ts';
import type {Slot} from '../../lib/slotProps.ts';

export interface SearchInputProps {
  /** Controlled value. Omit and pass `defaultValue` for uncontrolled use. */
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly placeholder?: string;
  /** Visually hidden label — the design shows no visible label. Defaults to the placeholder. */
  readonly label?: string;
  /** Set false to drop the clear button. */
  readonly isClearable?: boolean;
  readonly width?: string;
  readonly variant?: InputVariant;
  readonly xstyle?: stylex.StyleXStyles;
  // Slots forwarded to the underlying Input, plus the clear button.
  readonly rootProps?: Slot<'div'>;
  readonly labelProps?: Slot<'label'>;
  readonly inputProps?: Omit<Slot<'input'>, 'value' | 'defaultValue' | 'onChange'>;
  readonly clearButtonProps?: Partial<Omit<IconButtonProps, 'ref'>>;
}

/**
 * The search field, composed from `Input`: a decorative search glyph as the start adornment
 * and a clear `IconButton` as the end adornment when non-empty. It owns the controllable
 * value so it can show/act on the clear affordance, driving `Input` in controlled mode.
 * Slots forward to Input; `clearButtonProps` targets the clear button.
 */
export function SearchInput({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Search',
  label = placeholder,
  isClearable = true,
  width,
  variant,
  xstyle,
  rootProps,
  labelProps,
  inputProps,
  clearButtonProps,
}: SearchInputProps) {
  const [query, setQuery] = useControllableState({value, defaultValue, onChange});
  const hasClear = isClearable && query !== '';

  return (
    <Input
      type="search"
      value={query}
      onChange={setQuery}
      placeholder={placeholder}
      label={label}
      variant={variant}
      width={width}
      xstyle={xstyle}
      rootProps={rootProps}
      labelProps={labelProps}
      inputProps={inputProps}
      startIcon={<SearchIcon size="md" />}
      endIcon={
        hasClear ? (
          <IconButton
            icon={<CloseIcon size="sm" />}
            label={`Clear ${label.toLowerCase()}`}
            variant="subtle"
            size="md"
            {...clearButtonProps}
            onClick={() => setQuery('')}
          />
        ) : undefined
      }
    />
  );
}
