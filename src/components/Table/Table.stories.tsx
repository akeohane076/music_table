import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Table, type Column, type TableSort} from './Table.tsx';

interface Row {
  id: string;
  title: string;
  artist: string;
  genre: string;
}

const ROWS: Row[] = [
  {id: '1', title: 'All Along the Watchtower', artist: 'Jimi Hendrix', genre: 'Rock'},
  {id: '2', title: 'Bad Guy', artist: 'Billie Eilish', genre: 'Pop'},
  {id: '3', title: 'DNA.', artist: 'Kendrick Lamar', genre: 'Hip-Hop'},
];

const COLUMNS: Column<Row>[] = [
  {id: 'title', header: 'Title', cell: (r) => r.title, sortable: true, width: '30%'},
  {id: 'artist', header: 'Artist', cell: (r) => r.artist, sortable: true, width: '30%'},
  {id: 'genre', header: 'Genre', cell: (r) => r.genre},
];

const meta = {
  title: 'Data/Table',
  component: Table<Row>,
  args: {columns: COLUMNS, rows: ROWS, getRowId: (r) => r.id},
  parameters: {layout: 'padded'},
} satisfies Meta<typeof Table<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sortable Title/Artist, plain Genre — the same generic Table the songs page uses. */
export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<TableSort>({columnId: 'title', direction: 'asc'});
    return (
      <Table
        label="Songs"
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(r) => r.id}
        sort={sort}
        onSortChange={(columnId) =>
          setSort((s) =>
            s.columnId === columnId
              ? {columnId, direction: s.direction === 'asc' ? 'desc' : 'asc'}
              : {columnId, direction: 'asc'},
          )
        }
      />
    );
  },
};

export const Empty: Story = {
  render: () => (
    <Table
      label="Songs"
      columns={COLUMNS}
      rows={[]}
      getRowId={(r) => r.id}
      emptyState="No rows match your filters."
    />
  ),
};
