import type {ComponentPropsWithoutRef, CSSProperties} from 'react';

/** A spreadable bag of DOM props — the shape every `<part>Props` slot accepts. */
export type SlotProps = Record<string, unknown> & {
  readonly className?: string;
  readonly style?: CSSProperties;
};

/**
 * Arbitrary `data-*` attributes. `ComponentPropsWithoutRef` allows these on JSX intrinsics
 * but not when passed as a standalone props object, so slot types intersect this in.
 */
export type DataAttributes = {readonly [key: `data-${string}`]: string | number | boolean | undefined};

/** The prop type for a slot targeting element `E` — its DOM props plus `data-*`. */
export type Slot<E extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<E> & DataAttributes;

/**
 * Merge consumer slot props with a component's own props under a **guardrail** policy:
 *
 * - the component's own props win, protecting controlled values, identity (`id`), required
 *   ARIA/roles, and the compiled StyleX classes;
 * - `className` is concatenated (consumer + own), so a consumer can *add* classes without
 *   erasing the component's styling;
 * - `style` is shallow-merged with the component's winning on conflict;
 * - everything the component doesn't set — `data-*`, extra ARIA, `title`, handlers like
 *   `onFocus` — passes straight through.
 *
 * This is what makes composition safe: consumers reach into internal elements, but can't
 * accidentally break the parts that make the component correct.
 */
export function mergeSlot<T extends SlotProps>(consumer: SlotProps | undefined, own: T): T {
  if (!consumer) return own;
  const className = [consumer.className, own.className].filter(Boolean).join(' ') || undefined;
  const style = consumer.style || own.style ? {...consumer.style, ...own.style} : undefined;
  return {...consumer, ...own, className, style};
}
