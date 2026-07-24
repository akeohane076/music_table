export type Genre = 'Hip-Hop' | 'Pop' | 'Rock';

export interface Track {
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly genre: Genre;
}

/**
 * The first ten rows are exactly the tracks shown in the Figma, in the same order.
 * The rest widen the dataset so pagination actually paginates and the artist filter's
 * own search has enough options to be worth using — the design only ever showed five
 * artists, which is fewer than its own option list can display.
 */
export const TRACKS: readonly Track[] = [
  {id: 't01', title: 'All Along the Watchtower', artist: 'Jimi Hendrix', genre: 'Rock'},
  {id: 't02', title: 'Bad Guy', artist: 'Billie Eilish', genre: 'Pop'},
  {id: 't03', title: 'Dancing Queen', artist: 'ABBA', genre: 'Pop'},
  {id: 't04', title: 'DNA.', artist: 'Kendrick Lamar', genre: 'Hip-Hop'},
  {id: 't05', title: 'Happier Than Ever', artist: 'Billie Eilish', genre: 'Pop'},
  {id: 't06', title: 'HUMBLE.', artist: 'Kendrick Lamar', genre: 'Hip-Hop'},
  {id: 't07', title: 'Mamma Mia', artist: 'ABBA', genre: 'Pop'},
  {id: 't08', title: 'Purple Haze', artist: 'Jimi Hendrix', genre: 'Rock'},
  {id: 't09', title: 'Stairway to Heaven', artist: 'Led Zeppelin', genre: 'Rock'},
  {id: 't10', title: 'Whole Lotta Love', artist: 'Led Zeppelin', genre: 'Rock'},

  {id: 't11', title: 'Alright', artist: 'Kendrick Lamar', genre: 'Hip-Hop'},
  {id: 't12', title: 'B.O.B.', artist: 'Outkast', genre: 'Hip-Hop'},
  {id: 't13', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock'},
  {id: 't14', title: 'Come Together', artist: 'The Beatles', genre: 'Rock'},
  {id: 't15', title: 'Dreams', artist: 'Fleetwood Mac', genre: 'Rock'},
  {id: 't16', title: 'Fire', artist: 'Jimi Hendrix', genre: 'Rock'},
  {id: 't17', title: 'Gimme! Gimme! Gimme!', artist: 'ABBA', genre: 'Pop'},
  {id: 't18', title: 'Go Your Own Way', artist: 'Fleetwood Mac', genre: 'Rock'},
  {id: 't19', title: 'Hey Ya!', artist: 'Outkast', genre: 'Hip-Hop'},
  {id: 't20', title: 'Higher Ground', artist: 'Stevie Wonder', genre: 'Pop'},
  {id: 't21', title: 'Immigrant Song', artist: 'Led Zeppelin', genre: 'Rock'},
  {id: 't22', title: 'Kashmir', artist: 'Led Zeppelin', genre: 'Rock'},
  {id: 't23', title: 'Knowing Me, Knowing You', artist: 'ABBA', genre: 'Pop'},
  {id: 't24', title: 'Let It Be', artist: 'The Beatles', genre: 'Rock'},
  {id: 't25', title: 'Little Wing', artist: 'Jimi Hendrix', genre: 'Rock'},
  {id: 't26', title: 'Lovely', artist: 'Billie Eilish', genre: 'Pop'},
  {id: 't27', title: 'Ms. Jackson', artist: 'Outkast', genre: 'Hip-Hop'},
  {id: 't28', title: 'N.Y. State of Mind', artist: 'Nas', genre: 'Hip-Hop'},
  {id: 't29', title: 'Ocean Eyes', artist: 'Billie Eilish', genre: 'Pop'},
  {id: 't30', title: 'Rhiannon', artist: 'Fleetwood Mac', genre: 'Rock'},
  {id: 't31', title: 'Running Up That Hill', artist: 'Kate Bush', genre: 'Pop'},
  {id: 't32', title: 'Sir Duke', artist: 'Stevie Wonder', genre: 'Pop'},
  {id: 't33', title: 'Somebody to Love', artist: 'Queen', genre: 'Rock'},
  {id: 't34', title: 'Superstition', artist: 'Stevie Wonder', genre: 'Pop'},
  {id: 't35', title: 'The Chain', artist: 'Fleetwood Mac', genre: 'Rock'},
  {id: 't36', title: 'The World Is Yours', artist: 'Nas', genre: 'Hip-Hop'},
  {id: 't37', title: 'Under Pressure', artist: 'Queen', genre: 'Rock'},
  {id: 't38', title: 'Voodoo Child (Slight Return)', artist: 'Jimi Hendrix', genre: 'Rock'},
  {id: 't39', title: 'Waterloo', artist: 'ABBA', genre: 'Pop'},
  {id: 't40', title: 'Wuthering Heights', artist: 'Kate Bush', genre: 'Pop'},
];

/** Facets are derived from the data so adding a track never means editing a filter. */
function distinct<T extends string>(values: readonly T[]): readonly T[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export const ARTISTS = distinct(TRACKS.map((t) => t.artist));
export const GENRES = distinct(TRACKS.map((t) => t.genre));
