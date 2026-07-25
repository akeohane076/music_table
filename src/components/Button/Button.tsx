import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';
import * as stylex from '@stylexjs/stylex';
import {styles} from '../../theme/componentStyles.ts';
import {mergeSlot, type DataAttributes, type Slot} from '../../lib/slotProps.ts';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'pill';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'ref'>, DataAttributes {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  /** Rendered before the label. */
  readonly startIcon?: ReactNode;
  /** Rendered after the label — e.g. the pill's chevron. */
  readonly endIcon?: ReactNode;
  /** Draws the active outline (the `pill` variant's selected/open state). */
  readonly isActive?: boolean;
  /** StyleX escape hatch for one-off overrides without breaking the token contract. */
  readonly xstyle?: stylex.StyleXStyles;
  /** Spread onto the `<span>` wrapping the label. */
  readonly labelProps?: Slot<'span'>;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * The button primitive every actionable control composes from. The `pill` variant is the
 * filter trigger; `solid`/`outline` are the menu's Apply/Clear; `ghost` backs the sortable
 * table headers.
 *
 * Root props (`...rest`) spread onto the native `<button>` under the guardrail merge, so
 * callers keep `type`, `disabled`, ARIA, and the anchor callbacks Astryx's Popover injects,
 * while the compiled StyleX classes are always applied. `labelProps` targets the label span.
 */
export function Button({
  variant = 'solid',
  size = 'md',
  startIcon,
  endIcon,
  isActive = false,
  xstyle,
  labelProps,
  type = 'button',
  children,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      {...mergeSlot(rest, {
        type,
        ...stylex.props(
          styles.button.base,
          styles.button[size],
          styles.button[variant],
          isActive && styles.button.active,
          xstyle,
        ),
      })}
    >
      {startIcon}
      <span {...(labelProps ?? {})}>{children}</span>
      {endIcon}
    </button>
  );
}
