import {describe, expect, it} from 'vitest';
import {TRACKS} from '../data/tracks.ts';
import {
  clampPage,
  EMPTY_FILTERS,
  filterTracks,
  matchesQuery,
  pageCount,
  paginate,
  sortTracks,
} from './filtering.ts';

const track = {id: 'x', title: 'Purple Haze', artist: 'Jimi Hendrix', genre: 'Rock'} as const;

describe('matchesQuery', () => {
  it('treats a blank query as no constraint', () => {
    expect(matchesQuery(track, '')).toBe(true);
    expect(matchesQuery(track, '   ')).toBe(true);
  });

  it('matches on title, artist, or genre, case-insensitively', () => {
    expect(matchesQuery(track, 'purple')).toBe(true);
    expect(matchesQuery(track, 'HENDRIX')).toBe(true);
    expect(matchesQuery(track, 'rock')).toBe(true);
    expect(matchesQuery(track, 'jazz')).toBe(false);
  });

  it("reproduces the design's example: 'ab' finds ABBA by artist, not by title", () => {
    const titles = filterTracks(TRACKS, {...EMPTY_FILTERS, query: 'ab'}).map((t) => t.title);
    expect(titles).toContain('Dancing Queen');
    expect(titles).toContain('Mamma Mia');
    expect(titles.every((t) => !t.toLowerCase().includes('ab'))).toBe(true);
  });
});

describe('filterTracks', () => {
  it('intersects all three constraints', () => {
    const result = filterTracks(TRACKS, {query: '', artists: ['ABBA', 'Queen'], genre: 'Rock'});
    expect(result.map((t) => t.title)).toEqual(['Bohemian Rhapsody', 'Somebody to Love', 'Under Pressure']);
  });

  it('treats an empty artist list as no constraint rather than matching nothing', () => {
    expect(filterTracks(TRACKS, EMPTY_FILTERS)).toHaveLength(TRACKS.length);
  });

  it('can legitimately return nothing', () => {
    expect(filterTracks(TRACKS, {query: '', artists: ['ABBA'], genre: 'Rock'})).toEqual([]);
  });
});

describe('sortTracks', () => {
  it('sorts by column and direction without mutating the input', () => {
    const input = TRACKS.slice(0, 5);
    const desc = sortTracks(input, {column: 'title', direction: 'desc'});
    expect(desc[0].title).toBe('Happier Than Ever');
    expect(input[0].title).toBe('All Along the Watchtower');
  });

  it('orders punctuated titles the way a reader expects', () => {
    const sorted = sortTracks(
      TRACKS.filter((t) => t.title === 'DNA.' || t.title === 'Dancing Queen'),
      {column: 'title', direction: 'asc'},
    );
    expect(sorted.map((t) => t.title)).toEqual(['Dancing Queen', 'DNA.']);
  });
});

describe('pagination', () => {
  it('reports one page for an empty result set', () => {
    expect(pageCount(0, 10)).toBe(1);
  });

  it('slices the requested page', () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
  });

  it('pulls an out-of-range page back into bounds when filters shrink the results', () => {
    expect(clampPage(4, 40, 10)).toBe(4);
    expect(clampPage(4, 12, 10)).toBe(2);
    expect(clampPage(0, 40, 10)).toBe(1);
  });
});
