import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';
import * as stylex from '@stylexjs/stylex';
import {styles} from '../../theme/componentStyles.ts';

export type IconButtonVariant = 'ghost' | 'subtle' | 'plain';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'ref' | 'children'> {
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
 * × in a 24px target). Backs the pagination arrows, the search clear, and the remove-×.
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
      type={type}
      aria-label={label}
      {...rest}
      {...stylex.props(styles.iconButton.base, styles.iconButton[size], styles.iconButton[variant], xstyle)}
    >
      {icon}
    </button>
  );
}
