import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ARTISTS, GENRES} from '../data/tracks.ts';
import {MultiSelectFilter, SearchInput, SingleSelectFilter, toOptions} from '../components/filters';
import {color, font, radius, space, text} from '../theme/tokens.stylex.ts';

/**
 * Evidence, not decoration: the assignment asks the filters to be "reusable and easily
 * configurable", and the cheapest proof is driving the same components from different
 * data and different configuration. Nothing here imports a variant or a second
 * implementation — every case below is the same three components with different props.
 */

const ARTIST_OPTIONS = toOptions(ARTISTS);
const GENRE_OPTIONS = toOptions(GENRES);

/** Deliberately unlike the song facets: different value/label shapes and a long list. */
const DECADE_OPTIONS = [
  {value: '1960s', label: "'60s — British Invasion"},
  {value: '1970s', label: "'70s — Arena Rock"},
  {value: '1980s', label: "'80s — Synth Pop"},
  {value: '1990s', label: "'90s — Golden Age Hip-Hop"},
  {value: '2000s', label: "'00s — Indie Sleaze"},
  {value: '2010s', label: "'10s — Streaming Era"},
  {value: '2020s', label: "'20s — Bedroom Pop"},
];

const styles = stylex.create({
  heading: {
    margin: 0,
    fontFamily: font.family,
    fontSize: text.pageTitleSize,
    lineHeight: text.pageTitleLine,
    fontWeight: text.pageTitleWeight,
  },
  lede: {
    marginBlock: space.sm,
    fontFamily: font.family,
    fontSize: text.inputSize,
    color: color.textMuted,
    maxWidth: '60ch',
  },
  case: {
    marginBlockStart: space.xl,
    padding: space.lg,
    backgroundColor: color.surface,
    borderRadius: radius.card,
  },
  caseTitle: {
    margin: 0,
    marginBlockEnd: space.sm,
    fontFamily: font.family,
    fontSize: text.columnHeaderSize,
    fontWeight: text.columnHeaderWeight,
  },
  note: {
    margin: 0,
    marginBlockEnd: space.md,
    fontFamily: font.family,
    fontSize: text.paginationSize,
    color: color.textMuted,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    flexWrap: 'wrap',
  },
  state: {
    marginBlockStart: space.md,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '12px',
    color: color.textMuted,
  },
});

function Case({title, note, children, state}: {
  title: string;
  note: string;
  children: React.ReactNode;
  state: unknown;
}) {
  return (
    <section {...stylex.props(styles.case)}>
      <h2 {...stylex.props(styles.caseTitle)}>{title}</h2>
      <p {...stylex.props(styles.note)}>{note}</p>
      <div {...stylex.props(styles.row)}>{children}</div>
      <div {...stylex.props(styles.state)}>value = {JSON.stringify(state)}</div>
    </section>
  );
}

export function KitchenSink() {
  const [artists, setArtists] = useState<readonly string[]>([]);
  const [decades, setDecades] = useState<readonly string[]>(['1970s']);
  const [genre, setGenre] = useState<string | null>('Rock');
  const [required, setRequired] = useState<string | null>('Pop');
  const [query, setQuery] = useState('');
  const [bare, setBare] = useState('');

  return (
    <>
      <h1 {...stylex.props(styles.heading)}>Filter components — configurations</h1>
      <p {...stylex.props(styles.lede)}>
        The same three components as the Songs page, driven by different data and props.
      </p>

      <Case
        title="MultiSelectFilter — default"
        note="Artist facet exactly as the Songs page uses it: searchable, Apply-gated."
        state={artists}
      >
        <MultiSelectFilter
          label="Artist"
          options={ARTIST_OPTIONS}
          value={artists}
          onChange={setArtists}
          searchPlaceholder="Search Artists"
        />
      </Case>

      <Case
        title="MultiSelectFilter — relabelled, no search, seeded"
        note="Different value/label shapes, search disabled, custom button and heading copy, and a non-empty initial selection."
        state={decades}
      >
        <MultiSelectFilter
          label="Decade"
          options={DECADE_OPTIONS}
          value={decades}
          onChange={setDecades}
          isSearchable={false}
          selectedLabel="Picked"
          applyLabel="Save"
          clearLabel="Reset"
          formatTriggerLabel={(label, count) =>
            count ? `${count} decade${count === 1 ? '' : 's'}` : label
          }
        />
      </Case>

      <Case
        title="SingleSelectFilter — clearable vs required"
        note="Left clears when you re-pick the active option; right always holds a value."
        state={{genre, required}}
      >
        <SingleSelectFilter label="Genre" options={GENRE_OPTIONS} value={genre} onChange={setGenre} />
        <SingleSelectFilter
          label="Sort"
          options={GENRE_OPTIONS}
          value={required}
          onChange={setRequired}
          isClearable={false}
        />
      </Case>

      <Case
        title="SearchInput — clearable vs plain"
        note="The same component the Songs page uses, and the one nested inside the artist filter."
        state={{query, bare}}
      >
        <div style={{width: 300}}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search by title, artist or genre" />
        </div>
        <div style={{width: 220}}>
          <SearchInput value={bare} onChange={setBare} placeholder="No clear button" isClearable={false} />
        </div>
      </Case>
    </>
  );
}
