import {useId, type ReactNode, type Ref} from 'react';
import * as stylex from '@stylexjs/stylex';
import {styles} from '../../theme/componentStyles.ts';
import {useControllableState} from '../../hooks/useControllableState.ts';
import {mergeSlot, type Slot} from '../../lib/slotProps.ts';

export type InputVariant = 'boxed' | 'plain';

export interface InputProps {
  /** Controlled value. Omit and pass `defaultValue` for uncontrolled use. */
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly placeholder?: string;
  /** Visually hidden label — falls back to `inputProps['aria-label']` if omitted. */
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
  // Slot props — each spreads onto its element under the guardrail merge.
  readonly rootProps?: Slot<'div'>;
  readonly labelProps?: Slot<'label'>;
  readonly inputProps?: Omit<Slot<'input'>, 'value' | 'defaultValue' | 'onChange'>;
  readonly startIconProps?: Slot<'span'>;
  readonly endIconProps?: Slot<'span'>;
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Text-field primitive. Owns the boxed/plain surface, the focus ring, adornment slots, and
 * the controlled-or-uncontrolled value contract; `SearchInput` is a thin composition of it.
 * Every internal element (root, label, input, adornments) exposes a `*Props` slot merged
 * under the guardrail policy — the controlled value, id, and StyleX classes always win.
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
  rootProps,
  labelProps,
  inputProps,
  startIconProps,
  endIconProps,
  ref,
}: InputProps) {
  const id = useId();
  const [state, setState] = useControllableState({value, defaultValue, onChange});

  const rootSx = stylex.props(styles.input.field, variant === 'plain' && styles.input.plain, xstyle);
  const inputSx = stylex.props(
    styles.input.control,
    !!startIcon && styles.input.padStart,
    !!endIcon && styles.input.padEnd,
  );

  return (
    <div
      {...mergeSlot(rootProps, {
        className: rootSx.className,
        style: {...rootSx.style, ...(width ? {width} : {})},
      })}
    >
      {label && (
        <label {...mergeSlot(labelProps, {htmlFor: id, ...stylex.props(styles.input.srOnly)})}>
          {label}
        </label>
      )}
      {startIcon && (
        <span {...mergeSlot(startIconProps, {...stylex.props(styles.input.startAdornment)})}>
          {startIcon}
        </span>
      )}
      <input
        ref={ref}
        {...mergeSlot(inputProps, {
          id,
          type,
          value: state,
          placeholder,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => setState(event.target.value),
          className: inputSx.className,
          style: inputSx.style,
        })}
      />
      {endIcon && (
        <span {...mergeSlot(endIconProps, {...stylex.props(styles.input.endAdornment)})}>{endIcon}</span>
      )}
    </div>
  );
}
