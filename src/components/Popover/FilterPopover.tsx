import {useState, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Popover} from '@astryxdesign/core/Popover';
import {Button} from '../Button/index.ts';
import {ChevronIcon} from '../Icon/index.ts';
import {styles} from '../../theme/componentStyles.ts';
import type {Slot} from '../../lib/slotProps.ts';

export interface FilterMenuRenderProps {
  readonly isOpen: boolean;
  /** Dismiss the menu — e.g. after the single-select commits or Apply is pressed. */
  readonly close: () => void;
}

export interface FilterPopoverProps {
  /** Accessible name for the dialog and the source of the trigger's ARIA. */
  readonly label: string;
  /** Text shown on the trigger pill — each filter formats its own. */
  readonly triggerLabel: string;
  /** Draws the pill's active outline once the filter constrains the results. */
  readonly isActive: boolean;
  /** Fired on the closed→open transition. Filters use it to seed draft state. */
  readonly onOpen?: () => void;
  readonly width?: number | string;
  /** Spread onto the trigger pill, before Astryx's anchor/ARIA wiring (which wins). */
  readonly triggerProps?: Omit<Slot<'button'>, 'ref'>;
  readonly children: (props: FilterMenuRenderProps) => ReactNode;
}

/**
 * The popover shell shared by both filters. It owns open/close state, wires the Astryx
 * Popover to a `Button` pill trigger (with a caret that rotates on open), and resets
 * Astryx's surface — so every filter gets identical trigger behaviour, dismissal, focus
 * management, and anchoring, and each supplies only its own menu body through `children`.
 */
export function FilterPopover({
  label,
  triggerLabel,
  isActive,
  onOpen,
  width,
  triggerProps,
  children,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    setIsOpen(next);
    if (next) onOpen?.();
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement="below"
      alignment="start"
      label={label}
      width={width}
      xstyle={styles.popover.surface}
      content={children({isOpen, close: () => setIsOpen(false)})}
    >
      {(anchorProps) => (
        <Button
          variant="pill"
          isActive={isActive || isOpen}
          endIcon={
            <ChevronIcon
              size="sm"
              className={stylex.props(styles.popover.caret, isOpen && styles.popover.caretOpen).className}
            />
          }
          {...triggerProps}
          {...anchorProps}
        >
          {triggerLabel}
        </Button>
      )}
    </Popover>
  );
}
