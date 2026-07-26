import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {MultiSelectFilter} from './MultiSelectFilter.tsx';
import {Button} from '../../Button/index.ts';
import {toOptions} from '../types.ts';
import {TRACKS} from '../../../data/tracks.ts';

const TRACK_COUNTS = new Map<string, number>();
for (const track of TRACKS) {
  TRACK_COUNTS.set(track.artist, (TRACK_COUNTS.get(track.artist) ?? 0) + 1);
}

const ARTISTS = toOptions(['ABBA', 'Billie Eilish', 'Jimi Hendrix', 'Kendrick Lamar', 'Led Zeppelin']);

const DECADES = [
  {value: '1960s', label: "'60s — British Invasion"},
  {value: '1970s', label: "'70s — Arena Rock"},
  {value: '1980s', label: "'80s — Synth Pop"},
  {value: '1990s', label: "'90s — Golden Age Hip-Hop"},
];

const meta = {
  title: 'Filters/MultiSelectFilter',
  component: MultiSelectFilter,
  args: {label: 'Artist', options: ARTISTS, searchPlaceholder: 'Search Artists', value: [], onChange: () => {}},
  render: (args) => {
    const [value, setValue] = useState<readonly string[]>(args.value ?? []);
    return <MultiSelectFilter {...args} value={value} onChange={setValue} />;
  },
  parameters: {
    docs: {
      description: {
        component: 'Edits a draft committed only on Apply; dismissing discards it. Open the menu to try it.',
      },
    },
  },
} satisfies Meta<typeof MultiSelectFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The applied trigger reads `Artist (2)`. */
export const WithSelections: Story = {args: {value: ['Billie Eilish', 'Kendrick Lamar']}};

/** Same component, different data and config: relabeled, search off, custom button copy. */
export const Reconfigured: Story = {
  args: {
    label: 'Decade',
    options: DECADES,
    value: ['1970s'],
    isSearchable: false,
    selectedLabel: 'Picked',
    applyLabel: 'Save',
    clearLabel: 'Reset',
    formatTriggerLabel: (label, count) => (count ? `${count} decades` : label),
  },
};

/** Uncontrolled: the filter owns its committed state via `defaultValue`. */
export const Uncontrolled: Story = {
  render: () => (
    <MultiSelectFilter label="Artist" options={ARTISTS} defaultValue={['ABBA']} searchPlaceholder="Search Artists" />
  ),
};

/** The trigger is composed, not configured: any button can be passed as a child. */
export const CustomTrigger: Story = {
  render: () => {
    const [value, setValue] = useState<readonly string[]>([]);
    return (
      <MultiSelectFilter label="Artist" options={ARTISTS} value={value} onChange={setValue}>
        {({count}) => <Button variant="outline" size="sm">Artists{count ? ` · ${count}` : ''}</Button>}
      </MultiSelectFilter>
    );
  },
};

/**
 * renderOptionLabel adds content to each row (the checkbox machinery is untouched),
 * filterOption swaps matching to prefix-only, and searchProps reaches the inner search.
 */
export const CustomOptionRendering: Story = {
  render: () => {
    const [value, setValue] = useState<readonly string[]>(['Led Zeppelin']);
    return (
      <MultiSelectFilter
        label="Artist"
        options={ARTISTS}
        value={value}
        onChange={setValue}
        searchProps={{placeholder: 'Type a first letter…'}}
        filterOption={(option, q) => option.label.toLowerCase().startsWith(q)}
        renderOptionLabel={(option, {checked}) => (
          <>
            {option.label}
            <span style={{color: checked ? '#006088' : '#757575', marginInlineStart: 6, fontSize: 12}}>
              · {TRACK_COUNTS.get(option.value) ?? 0} tracks
            </span>
          </>
        )}
      />
    );
  },
};
