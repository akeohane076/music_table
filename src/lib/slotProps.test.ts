import {describe, expect, it} from 'vitest';
import {mergeSlot} from './slotProps.ts';

describe('mergeSlot (guardrail merge)', () => {
  it('concatenates className (consumer + component)', () => {
    const merged = mergeSlot({className: 'consumer'}, {className: 'own x1'});
    expect(merged.className).toBe('consumer own x1');
  });

  it("lets the component's own props win, protecting correctness", () => {
    // A consumer must not be able to override a controlled value or required role.
    const merged = mergeSlot({id: 'theirs', role: 'button'}, {id: 'ours', role: 'menuitemradio'});
    expect(merged.id).toBe('ours');
    expect(merged.role).toBe('menuitemradio');
  });

  it('shallow-merges style with the component winning on conflict', () => {
    const merged = mergeSlot({style: {color: 'red', margin: 4}}, {style: {color: 'blue'}});
    expect(merged.style).toEqual({color: 'blue', margin: 4});
  });

  it('passes consumer extras through untouched', () => {
    const onFocus = () => {};
    const merged = mergeSlot({'data-testid': 'x', onFocus, title: 'hi'}, {id: 'own'});
    expect(merged).toMatchObject({'data-testid': 'x', onFocus, title: 'hi', id: 'own'});
  });

  it('returns the component props unchanged when there is no consumer slot', () => {
    const own = {id: 'own', className: 'c'};
    expect(mergeSlot(undefined, own)).toBe(own);
  });
});
