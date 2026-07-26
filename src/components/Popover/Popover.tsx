import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {Popover as AstryxPopover} from '@astryxdesign/core/Popover';
import {styles} from '../../theme/componentStyles.ts';
import {useControllableState} from '../../hooks/useControllableState.ts';
import {mergeSlot, type SlotProps} from '../../lib/slotProps.ts';

type AstryxPopoverProps = ComponentProps<typeof AstryxPopover>;

export interface PopoverContextValue {
  readonly isOpen: boolean;
  readonly close: () => void;
  readonly setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

/** Read the enclosing Popover's open state — e.g. a trigger rotating a caret. */
export function usePopover(): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('usePopover must be used within <Popover>');
  return ctx;
}

/** Content is a node, or a render-prop receiving the popover context (for `close`). */
export type PopoverContentChildren = ReactNode | ((ctx: PopoverContextValue) => ReactNode);

/** Marker: its single child is the trigger. The parent `Popover` extracts and wires it. */
export function PopoverTrigger(_props: {children: ReactNode}): null {
  return null;
}

/** Marker: its child is the content — a node, or `(ctx) => node` to receive `close`. */
export function PopoverContent(_props: {children: PopoverContentChildren}): null {
  return null;
}

export interface PopoverProps {
  /** Exactly a `<Popover.Trigger>` and a `<Popover.Content>`. */
  readonly children: ReactNode;
  /** Controlled open state. Omit and use `defaultOpen` for uncontrolled. */
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /** Fires on the closed→open transition (e.g. to seed draft state). */
  readonly onOpen?: () => void;
  readonly placement?: AstryxPopoverProps['placement'];
  readonly alignment?: AstryxPopoverProps['alignment'];
  /** Accessible name for the dialog. */
  readonly label?: string;
  readonly width?: number | string;
}

/**
 * Generic popover, composed as `<Popover><Popover.Trigger/><Popover.Content/></Popover>`.
 * It owns open state, shares `{isOpen, close}` via context (`usePopover`), and bridges to
 * Astryx's Popover — cloning the trigger child with Astryx's anchor/ARIA wiring, and passing
 * the content (a node, or `(ctx) => node` for `close`). The surface reset keeps the flat
 * white card the menus supply themselves.
 */
export function Popover({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onOpen,
  placement = 'below',
  alignment = 'start',
  label,
  width,
}: PopoverProps) {
  const [isOpen, setOpen] = useControllableState({value: open, defaultValue: defaultOpen, onChange: onOpenChange});

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) onOpen?.();
  }

  // Pull the trigger element and content out of the compound children (by marker type).
  let triggerChild: ReactNode = null;
  let contentChild: PopoverContentChildren = null;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === PopoverTrigger) triggerChild = (child.props as {children?: ReactNode}).children ?? null;
    else if (child.type === PopoverContent) {
      contentChild = (child.props as {children?: PopoverContentChildren}).children ?? null;
    }
  });

  const ctx: PopoverContextValue = {isOpen, close: () => setOpen(false), setOpen};
  const content =
    typeof contentChild === 'function'
      ? (contentChild as (c: PopoverContextValue) => ReactNode)(ctx)
      : contentChild;

  return (
    <PopoverContext.Provider value={ctx}>
      <AstryxPopover
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        placement={placement}
        alignment={alignment}
        label={label}
        width={width}
        xstyle={styles.popover.surface}
        // Astryx wraps content in a dark elevated surface and pads it; the high-level
        // Popover exposes neither hasSurface nor an xstyle route to that wrapper — xstyle
        // lands on an inner padding div, and its dynamic StyleX merge is dropped by the
        // production compile (v0.1.8), which is exactly how the dark frame shipped: the
        // returning padding let the surface show around the menu card. Zeroing the padding
        // inline is compile-proof — the card then covers the surface in every build.
        // Guarded by e2e/prod-smoke.spec.ts against the built bundle.
        style={{padding: 0}}
        content={content}
      >
        {(anchorProps) =>
          isValidElement<Record<string, unknown>>(triggerChild)
            ? cloneElement(
                triggerChild,
                mergeSlot(triggerChild.props as SlotProps, anchorProps as unknown as SlotProps),
              )
            : triggerChild
        }
      </AstryxPopover>
    </PopoverContext.Provider>
  );
}

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
