import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';
import * as stylex from '@stylexjs/stylex';
import {styles} from '../../theme/componentStyles.ts';
import {mergeSlot, type DataAttributes} from '../../lib/slotProps.ts';

export type IconButtonVariant = 'ghost' | 'subtle' | 'plain';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'ref' | 'children'>,
    DataAttributes {
  /** The glyph to render — sized by the caller (e.g. `<CloseIcon size="sm" />`). */
  readonly icon: ReactNode;
  /** Accessible name — required, since there is no visible text. */
  readonly label: string;
  readonly variant?: IconButtonVariant;
  readonly size?: IconButtonSize;
  readonly xstyle?: stylex.StyleXStyles;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * Icon-only button with a mandatory accessible name. The `size` sets the square hit area;
 * the caller controls the glyph's own size, so hit target and icon can differ (e.g. a 16px
 * × in a 24px target). Root props (`...rest`) spread onto the `<button>` under the guardrail
 * merge — the accessible label and StyleX classes are always applied.
 */
export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  xstyle,
  type = 'button',
  ref,
  ...rest
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      {...mergeSlot(rest, {
        type,
        'aria-label': label,
        ...stylex.props(styles.iconButton.base, styles.iconButton[size], styles.iconButton[variant], xstyle),
      })}
    >
      {icon}
    </button>
  );
}
