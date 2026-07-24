import {useId} from 'react';
import * as stylex from '@stylexjs/stylex';
import {CloseIcon, SearchIcon} from '../icons.tsx';
import {color, font, radius, size, text} from '../../theme/tokens.stylex.ts';

export interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  /** Visually hidden unless provided — the design shows no visible label. */
  readonly label?: string;
  /** Set false to drop the clear button. */
  readonly isClearable?: boolean;
  readonly width?: string;
  /**
   * `boxed` is the standalone field on the page. `plain` drops the surface and border
   * for use inside a popover, where the containing row already provides the chrome.
   */
  readonly variant?: 'boxed' | 'plain';
}

const styles = stylex.create({
  field: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: size.controlHeight,
    width: '100%',
    backgroundColor: color.surface,
    borderRadius: radius.control,
    borderWidth: '1px',
    borderStyle: 'solid',
    // Transparent by default so gaining the focus outline never shifts layout.
    borderColor: {
      default: 'transparent',
      ':hover': color.iconMuted,
      ':focus-within': color.borderStrong,
    },
  },
  plain: {
    backgroundColor: 'transparent',
    borderColor: {default: 'transparent', ':hover': 'transparent', ':focus-within': 'transparent'},
    borderRadius: 0,
    // The popover's own 48px header row supplies the height and the divider.
    height: '100%',
  },
  icon: {
    position: 'absolute',
    insetInlineStart: '12px',
    color: color.iconStrong,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    height: '100%',
    // 40px start inset clears the 20px glyph sitting at 12px.
    paddingInlineStart: '40px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius.control,
    fontFamily: font.family,
    fontSize: text.inputSize,
    lineHeight: text.inputLine,
    fontWeight: text.inputWeight,
    color: color.textPrimary,
    '::placeholder': {
      color: color.textMuted,
      opacity: 1,
    },
    // Chrome renders its own clear affordance on type=search; ours replaces it.
    '::-webkit-search-cancel-button': {
      display: 'none',
    },
  },
  /** Only reserved while the clear button is actually rendered, so the placeholder
   * has the full field width when the input is empty — as in the design. */
  inputClearable: {
    paddingInlineEnd: '40px',
  },
  clear: {
    position: 'absolute',
    insetInlineEnd: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    padding: 0,
    border: 'none',
    borderRadius: radius.control,
    backgroundColor: {default: 'transparent', ':hover': color.pageBg},
    color: color.textPrimary,
    cursor: 'pointer',
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

/**
 * Required component #1. Deliberately presentation-only and fully controlled — it
 * holds no query state of its own, so the page owns a single source of truth and the
 * same component can drive the page search and the artist filter's inner search.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  label = placeholder,
  isClearable = true,
  width,
  variant = 'boxed',
}: SearchInputProps) {
  const id = useId();
  const hasClearButton = isClearable && value !== '';

  return (
    <div
      {...stylex.props(styles.field, variant === 'plain' && styles.plain)}
      style={width ? {width} : undefined}
    >
      <label htmlFor={id} {...stylex.props(styles.srOnly)}>
        {label}
      </label>
      <SearchIcon size={20} {...stylex.props(styles.icon)} />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        {...stylex.props(styles.input, hasClearButton && styles.inputClearable)}
      />
      {hasClearButton && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={`Clear ${label.toLowerCase()}`}
          {...stylex.props(styles.clear)}
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
}
