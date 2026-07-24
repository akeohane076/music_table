/**
 * Public surface of the filter component set. Consumers import from here rather than
 * reaching into individual files, so internal structure can change without breaking
 * them — the same boundary an npm package would publish.
 */

// The three components the page composes.
export {SearchInput, type SearchInputProps} from './SearchInput.tsx';
export {SingleSelectFilter, type SingleSelectFilterProps} from './SingleSelectFilter.tsx';
export {MultiSelectFilter, type MultiSelectFilterProps} from './MultiSelectFilter.tsx';

// Shared primitives, exposed so new filters can be built on the same foundation.
export {FilterPill, type FilterPillProps} from './FilterPill.tsx';
export {FilterPopover, type FilterPopoverProps, type FilterMenuRenderProps} from './FilterPopover.tsx';

// The option shape every select-style filter speaks, plus its convenience builder.
export {toOptions, type FilterOption} from './types.ts';
