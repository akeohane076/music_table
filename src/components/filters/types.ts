/**
 * The shared option shape for both filters. Keeping `value` distinct from `label` is what
 * lets the same components drive facets whose display text differs from the stored value.
 */
export interface FilterOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
}

/** Convenience for the common case where the value is its own label. */
export function toOptions<T extends string>(values: readonly T[]): FilterOption<T>[] {
  return values.map((value) => ({value, label: value}));
}
