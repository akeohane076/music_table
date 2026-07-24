import {useMemo, useState} from 'react';
import type {Track} from '../data/tracks.ts';
import {
  clampPage,
  EMPTY_FILTERS,
  filterTracks,
  pageCount,
  paginate,
  sortTracks,
  type FilterState,
  type Sort,
  type SortColumn,
} from '../lib/filtering.ts';

export const PAGE_SIZE = 10;

/**
 * Owns the page's filter/sort/pagination state and derives the visible rows from it.
 * The filter components stay controlled and stateless (bar the multi-select's draft),
 * so this hook is the single source of truth for what the table shows.
 */
export function useTrackFilters(tracks: readonly Track[], pageSize = PAGE_SIZE) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<Sort>({column: 'title', direction: 'asc'});
  const [requestedPage, setRequestedPage] = useState(1);

  const matched = useMemo(() => filterTracks(tracks, filters), [tracks, filters]);
  const sorted = useMemo(() => sortTracks(matched, sort), [matched, sort]);

  // Derived rather than stored: narrowing the filters must never strand the user on a
  // page that no longer exists, and storing the clamped value would fight the setter.
  const page = clampPage(requestedPage, sorted.length, pageSize);
  const totalPages = pageCount(sorted.length, pageSize);
  const rows = useMemo(() => paginate(sorted, page, pageSize), [sorted, page, pageSize]);

  /** Clicking the active column flips direction; a new column starts ascending. */
  function toggleSort(column: SortColumn) {
    setSort((current) =>
      current.column === column
        ? {column, direction: current.direction === 'asc' ? 'desc' : 'asc'}
        : {column, direction: 'asc'},
    );
    setRequestedPage(1);
  }

  function updateFilters(next: Partial<FilterState>) {
    setFilters((current) => ({...current, ...next}));
    setRequestedPage(1);
  }

  return {
    filters,
    updateFilters,
    sort,
    toggleSort,
    page,
    totalPages,
    setPage: setRequestedPage,
    rows,
    totalMatched: sorted.length,
  };
}
