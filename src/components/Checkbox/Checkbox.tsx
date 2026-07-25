import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';
import * as stylex from '@stylexjs/stylex';
import {CheckIcon} from '../Icon/index.ts';
import {styles} from '../../theme/componentStyles.ts';
import {mergeSlot, type Slot} from '../../lib/slotProps.ts';

export interface CheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  /** The label — rendered inside the clickable row. */
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly xstyle?: stylex.StyleXStyles;
  // Slot props for the internal parts (guardrail-merged).
  readonly labelProps?: Slot<'span'>;
  readonly inputProps?: Omit<Slot<'input'>, 'type' | 'checked' | 'onChange'>;
  readonly boxProps?: Slot<'span'>;
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * A checkbox with its label as one clickable row. A real, visually-hidden
 * `<input type="checkbox">` drives it — so checked state, keyboard, and form semantics come
 * from the platform — behind a styled box that fills with the accent when checked. Reusable
 * anywhere; the multi-select filter builds its option list from it.
 */
export function Checkbox({
  checked,
  onChange,
  children,
  disabled,
  xstyle,
  labelProps,
  inputProps,
  boxProps,
  ref,
}: CheckboxProps) {
  return (
    <label {...stylex.props(styles.checkbox.root, xstyle)}>
      <input
        ref={ref}
        {...mergeSlot(inputProps as ComponentPropsWithoutRef<'input'>, {
          type: 'checkbox',
          checked,
          disabled,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.checked),
          ...stylex.props(styles.checkbox.input),
        })}
      />
      <span
        aria-hidden="true"
        {...mergeSlot(boxProps, {
          ...stylex.props(styles.checkbox.box, checked && styles.checkbox.boxChecked),
        })}
      >
        <CheckIcon size={14} />
      </span>
      <span {...mergeSlot(labelProps, {...stylex.props(styles.checkbox.label)})}>{children}</span>
    </label>
  );
}
