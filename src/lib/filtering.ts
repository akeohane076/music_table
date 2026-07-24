import type {Track} from '../data/tracks.ts';

/** Only Title and Artist carry sort affordances in the design; Genre does not. */
export type SortColumn = 'title' | 'artist';
export type SortDirection = 'asc' | 'desc';

export interface Sort {
  readonly column: SortColumn;
  readonly direction: SortDirection;
}

export interface FilterState {
  /** Free-text query matched against title, artist, and genre. */
  readonly query: string;
  /** Empty means "no artist constraint", not "no artists match". */
  readonly artists: readonly string[];
  /** `null` means no genre constraint. */
  readonly genre: string | null;
}

export const EMPTY_FILTERS: FilterState = {query: '', artists: [], genre: null};

/**
 * The placeholder promises "title, artist or genre", and the design confirms it —
 * searching "ab" in the mock returns ABBA's tracks by artist, not by title.
 */
export function matchesQuery(track: Track, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    track.title.toLowerCase().includes(q) ||
    track.artist.toLowerCase().includes(q) ||
    track.genre.toLowerCase().includes(q)
  );
}

/** The three filters intersect: a track must satisfy every active constraint. */
export function filterTracks(tracks: readonly Track[], filters: FilterState): Track[] {
  const artists = new Set(filters.artists);
  return tracks.filter(
    (track) =>
      matchesQuery(track, filters.query) &&
      (artists.size === 0 || artists.has(track.artist)) &&
      (filters.genre === null || track.genre === filters.genre),
  );
}

export function sortTracks(tracks: readonly Track[], sort: Sort): Track[] {
  const factor = sort.direction === 'asc' ? 1 : -1;
  // localeCompare so "DNA." and "Dancing Queen" order the way a reader expects.
  return [...tracks].sort((a, b) => a[sort.column].localeCompare(b[sort.column]) * factor);
}

export function pageCount(total: number, pageSize: number): number {
  // An empty result set is still one (empty) page, so the footer never reads "0 of 0".
  return Math.max(1, Math.ceil(total / pageSize));
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Selecting a filter can shrink the result set below the current page, which would
 * otherwise strand the user on an empty page.
 */
export function clampPage(page: number, total: number, pageSize: number): number {
  return Math.min(Math.max(1, page), pageCount(total, pageSize));
}
