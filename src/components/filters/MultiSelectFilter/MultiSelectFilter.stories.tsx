import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {MultiSelectFilter} from './MultiSelectFilter.tsx';
import {toOptions} from '../types.ts';

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
