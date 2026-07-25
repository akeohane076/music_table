import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {IconButton, type IconButtonProps} from '../IconButton/index.ts';
import {CloseIcon} from '../Icon/index.ts';
import {styles} from '../../theme/componentStyles.ts';
import {mergeSlot, type Slot} from '../../lib/slotProps.ts';

export interface RemovableTagProps {
  /** The visible label. */
  readonly children: ReactNode;
  readonly onRemove: () => void;
  /** Accessible name for the remove button — required, since it's icon-only. */
  readonly removeLabel: string;
  readonly xstyle?: stylex.StyleXStyles;
  readonly labelProps?: Slot<'span'>;
  /** Spread onto the remove `IconButton`. */
  readonly removeButtonProps?: Partial<Omit<IconButtonProps, 'ref'>>;
}

/**
 * A label with a leading × that removes it — the "×+label" pair. Composes an `IconButton`
 * (whose `onRemove` is the guardrail: consumer `removeButtonProps` can relabel or restyle it,
 * not un-wire it) with the label. The multi-select's Selected column is a list of these.
 */
export function RemovableTag({
  children,
  onRemove,
  removeLabel,
  xstyle,
  labelProps,
  removeButtonProps,
}: RemovableTagProps) {
  return (
    <div {...stylex.props(styles.removableTag.root, xstyle)}>
      <IconButton
        icon={<CloseIcon size="sm" />}
        label={removeLabel}
        variant="plain"
        size="xs"
        {...removeButtonProps}
        onClick={onRemove}
      />
      <span {...mergeSlot(labelProps, {...stylex.props(styles.removableTag.label)})}>{children}</span>
    </div>
  );
}
