import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Button} from '../../Button/index.ts';
import {ChevronIcon} from '../../Icon/index.ts';
import {usePopover} from '../../Popover/index.ts';
import {styles} from '../../../theme/componentStyles.ts';

export interface FilterTriggerProps extends Omit<ComponentPropsWithoutRef<'button'>, 'ref'> {
  /** Draws the active outline once the filter constrains results. */
  readonly isActive?: boolean;
  readonly children: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * The filter trigger convenience: a `Button` `pill` with a chevron that rotates on open. It
 * reads `usePopover().isOpen` for the caret and the active-on-open outline, so it must render
 * inside a `<Popover>`. Consumers who want a different trigger can pass any `Button` instead —
 * this is just the default the filters reach for.
 */
export function FilterTrigger({isActive = false, children, ref, ...rest}: FilterTriggerProps) {
  const {isOpen} = usePopover();
  return (
    <Button
      ref={ref}
      variant="pill"
      isActive={isActive || isOpen}
      endIcon={
        <ChevronIcon
          size="sm"
          className={stylex.props(styles.popover.caret, isOpen && styles.popover.caretOpen).className}
        />
      }
      {...rest}
    >
      {children}
    </Button>
  );
}
