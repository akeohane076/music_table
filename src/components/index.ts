/**
 * Public surface of the component library. Primitives first (Button, IconButton, Input,
 * Icon), then the shared Popover shell, the generic Table/Pagination, and the filter set.
 * The same boundary an npm package would publish.
 */
export * from './Button/index.ts';
export * from './IconButton/index.ts';
export * from './Icon/index.ts';
export * from './Input/index.ts';
export * from './SearchInput/index.ts';
export * from './Checkbox/index.ts';
export * from './RemovableTag/index.ts';
export * from './ButtonBar/index.ts';
export * from './Popover/index.ts';
export * from './Table/index.ts';
export * from './Pagination/index.ts';
export * from './filters/index.ts';

// The guardrail merge, exported so consumers building their own components on these
// primitives get the same slot-props policy.
export {mergeSlot, type SlotProps} from '../lib/slotProps.ts';
