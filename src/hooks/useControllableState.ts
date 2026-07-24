import {useCallback, useState} from 'react';

export interface ControllableStateOptions<T> {
  /** When provided, the component is controlled and this value always wins. */
  readonly value?: T;
  /** Initial value in uncontrolled mode. */
  readonly defaultValue: T;
  /** Called on every change, in both modes, with the next value. */
  readonly onChange?: (value: T) => void;
}

/**
 * One hook for the controlled-or-uncontrolled contract. Pass `value` to control the
 * component from the outside; omit it and pass `defaultValue` to let the component own its
 * state. Either way `onChange` fires with the next value, so a controlled parent and an
 * uncontrolled consumer use the identical API. Modelled on the Radix/Reach pattern.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? (value as T) : internal;

  const setState = useCallback(
    (next: T) => {
      // In controlled mode the parent owns the value; we only notify. In uncontrolled
      // mode we update our own copy and notify.
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [state, setState];
}
