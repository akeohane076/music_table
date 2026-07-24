import {useId, type ComponentPropsWithoutRef, type ReactNode, type Ref} from 'react';
import * as stylex from '@stylexjs/stylex';
import {styles} from '../../theme/componentStyles.ts';
import {useControllableState} from '../../hooks/useControllableState.ts';

export type InputVariant = 'boxed' | 'plain';

export interface InputProps {
  /** Controlled value. Omit and pass `defaultValue` for uncontrolled use. */
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly placeholder?: string;
  /** Visually hidden label; falls back to `inputProps['aria-label']` if omitted. */
  readonly label?: string;
  /** Decorative glyph before the text (clicks fall through). */
  readonly startIcon?: ReactNode;
  /** Interactive slot after the text — e.g. a clear button. */
  readonly endIcon?: ReactNode;
  /** `boxed` is the standalone field; `plain` drops the surface for use inside a container. */
  readonly variant?: InputVariant;
  readonly type?: string;
  readonly width?: string;
  readonly xstyle?: stylex.StyleXStyles;
  /** Spread onto the inner `<input>` — extra ARIA, autoComplete, name, etc. */
  readonly inputProps?: Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'defaultValue' | 'onChange'>;
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Text-field primitive. Owns the boxed/plain surface, the focus ring, adornment slots, and
 * the controlled-or-uncontrolled value contract; `SearchInput` is a thin composition of it.
 */
export function Input({
  value,
  defaultValue = '',
  onChange,
  placeholder,
  label,
  startIcon,
  endIcon,
  variant = 'boxed',
  type = 'text',
  width,
  xstyle,
  inputProps,
  ref,
}: InputProps) {
  const id = useId();
  const [state, setState] = useControllableState({value, defaultValue, onChange});

  return (
    <div
      {...stylex.props(styles.input.field, variant === 'plain' && styles.input.plain, xstyle)}
      style={width ? {width} : undefined}
    >
      {label && (
        <label htmlFor={id} {...stylex.props(styles.input.srOnly)}>
          {label}
        </label>
      )}
      {startIcon && <span {...stylex.props(styles.input.startAdornment)}>{startIcon}</span>}
      <input
        id={id}
        ref={ref}
        type={type}
        value={state}
        placeholder={placeholder}
        onChange={(event) => setState(event.target.value)}
        {...inputProps}
        {...stylex.props(styles.input.control, !!startIcon && styles.input.padStart, !!endIcon && styles.input.padEnd)}
      />
      {endIcon && <span {...stylex.props(styles.input.endAdornment)}>{endIcon}</span>}
    </div>
  );
}
