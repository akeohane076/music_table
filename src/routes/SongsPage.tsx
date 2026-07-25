import * as stylex from '@stylexjs/stylex';
import {ARTISTS, GENRES, TRACKS, type Track} from '../data/tracks.ts';
import {useTrackFilters} from '../hooks/useTrackFilters.ts';
import type {SortColumn} from '../lib/filtering.ts';
import {
  MultiSelectFilter,
  Pagination,
  SearchInput,
  SingleSelectFilter,
  Table,
  toOptions,
  type Column,
} from '../components/index.ts';
import {color, font, radius, size, space, text} from '../theme/tokens.stylex.ts';

const ARTIST_OPTIONS = toOptions(ARTISTS);
const GENRE_OPTIONS = toOptions(GENRES);

// How each field is rendered and sorted. Passing this to the generic Table keeps the songs
// concern (which columns, which are sortable) here, out of the reusable component.
const TRACK_COLUMNS: Column<Track>[] = [
  // Column boundaries measured from the design's text starts: 316px and 344px of the
  // 1200px content width (43→359→703 in the frame) = 26.333% / 28.667%.
  {id: 'title', header: 'Title', cell: (t) => t.title, sortable: true, width: '26.333%'},
  {id: 'artist', header: 'Artist', cell: (t) => t.artist, sortable: true, width: '28.667%'},
  {id: 'genre', header: 'Genre', cell: (t) => t.genre},
];

const styles = stylex.create({
  title: {
    margin: 0,
    fontFamily: font.family,
    fontSize: text.pageTitleSize,
    lineHeight: text.pageTitleLine,
    fontWeight: text.pageTitleWeight,
    color: color.textPrimary,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    // Wraps rather than overflowing once the viewport can't hold one row.
    flexWrap: 'wrap',
    marginBlockStart: space.xl,
    marginBlockEnd: space.lg,
  },
  search: {
    width: size.searchWidth,
    maxWidth: '100%',
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingInline: space.lg,
    paddingBlock: space.lg,
  },
});

export function SongsPage() {
  const {filters, updateFilters, sort, toggleSort, page, totalPages, setPage, rows} =
    useTrackFilters(TRACKS);

  return (
    <>
      <h1 {...stylex.props(styles.title)}>Songs</h1>

      <div {...stylex.props(styles.filterBar)}>
        <div {...stylex.props(styles.search)}>
          <SearchInput
            value={filters.query}
            onChange={(query) => updateFilters({query})}
            placeholder="Search by title, artist or genre"
            label="Search songs"
          />
        </div>

        <MultiSelectFilter
          label="Artist"
          options={ARTIST_OPTIONS}
          value={filters.artists}
          onChange={(artists) => updateFilters({artists})}
          searchPlaceholder="Search Artists"
        />

        <SingleSelectFilter
          label="Genre"
          options={GENRE_OPTIONS}
          value={filters.genre}
          onChange={(genre) => updateFilters({genre})}
        />
      </div>

      <div {...stylex.props(styles.card)}>
        <Table
          label="Songs"
          columns={TRACK_COLUMNS}
          rows={rows}
          getRowId={(track) => track.id}
          sort={{columnId: sort.column, direction: sort.direction}}
          onSortChange={(columnId) => toggleSort(columnId as SortColumn)}
          emptyState="No songs match your filters."
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
