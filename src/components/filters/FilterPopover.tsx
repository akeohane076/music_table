import {useState, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Popover} from '@astryxdesign/core/Popover';
import {FilterPill} from './FilterPill.tsx';
import {radius} from '../../theme/tokens.stylex.ts';

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
  readonly children: (props: FilterMenuRenderProps) => ReactNode;
}

const styles = stylex.create({
  // Astryx's Popover ships a dark themed surface with a 12px radius. Reduce it to a
  // bare positioning shell so each menu supplies its own flat white 4px card, while the
  // popover keeps doing the work worth inheriting: anchoring, focus, and dismissal.
  surface: {
    width: 'auto',
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: radius.control,
    boxShadow: 'none',
    borderWidth: 0,
  },
});

/**
 * The popover shell shared by both filters. It owns open/close state, wires the Astryx
 * Popover to the shared FilterPill trigger, and resets Astryx's surface — so every
 * filter gets identical trigger behaviour, dismissal, focus management, and anchoring,
 * and each one supplies only its own menu body through `children`.
 *
 * This is the seam that keeps the filters consistent: a change to how filters open,
 * anchor, or present their trigger happens here once, not in each filter.
 */
export function FilterPopover({
  label,
  triggerLabel,
  isActive,
  onOpen,
  width,
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
      xstyle={styles.surface}
      content={children({isOpen, close: () => setIsOpen(false)})}
    >
      {(triggerProps) => (
        <FilterPill {...triggerProps} label={triggerLabel} isOpen={isOpen} isActive={isActive} />
      )}
    </Popover>
  );
}
