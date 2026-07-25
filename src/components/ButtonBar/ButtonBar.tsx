import type {ComponentPropsWithoutRef, ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {styles} from '../../theme/componentStyles.ts';
import {mergeSlot, type DataAttributes} from '../../lib/slotProps.ts';

export type ButtonBarAlign = 'start' | 'center' | 'end' | 'between';

export interface ButtonBarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'ref'>, DataAttributes {
  readonly children: ReactNode;
  /** Horizontal placement of the buttons. Defaults to `end` (Clear/Apply on the right). */
  readonly align?: ButtonBarAlign;
  readonly xstyle?: stylex.StyleXStyles;
}

/**
 * A horizontal bar of actions with a top divider — the menu footer. Layout only: it holds
 * `Button`s and places them (default `end`), so a consumer controls which actions appear and
 * in what order. `...rest` spreads onto the container under the guardrail merge.
 */
export function ButtonBar({children, align = 'end', xstyle, ...rest}: ButtonBarProps) {
  return (
    <div {...mergeSlot(rest, {...stylex.props(styles.buttonBar.root, styles.buttonBar[align], xstyle)})}>
      {children}
    </div>
  );
}
