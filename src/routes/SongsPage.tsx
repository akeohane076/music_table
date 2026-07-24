import * as stylex from '@stylexjs/stylex';
import {ARTISTS, GENRES, TRACKS} from '../data/tracks.ts';
import {useTrackFilters} from '../hooks/useTrackFilters.ts';
import {MultiSelectFilter} from '../components/filters/MultiSelectFilter.tsx';
import {SearchInput} from '../components/filters/SearchInput.tsx';
import {SingleSelectFilter} from '../components/filters/SingleSelectFilter.tsx';
import {toOptions} from '../components/filters/types.ts';
import {TrackTable} from '../components/table/TrackTable.tsx';
import {color, font, size, space, text} from '../theme/tokens.stylex.ts';

const ARTIST_OPTIONS = toOptions(ARTISTS);
const GENRE_OPTIONS = toOptions(GENRES);

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

      <TrackTable
        rows={rows}
        sort={sort}
        onSort={toggleSort}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
