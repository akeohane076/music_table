import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {SingleSelectFilter} from './SingleSelectFilter.tsx';
import {toOptions} from './types.ts';

const GENRES = toOptions(['Hip-Hop', 'Pop', 'Rock']);

const meta = {
  title: 'Filters/SingleSelectFilter',
  component: SingleSelectFilter,
  args: {label: 'Genre', options: GENRES, value: null, onChange: () => {}},
  render: (args) => {
    const [value, setValue] = useState<string | null>(args.value ?? null);
    return <SingleSelectFilter {...args} value={value} onChange={setValue} />;
  },
  parameters: {docs: {description: {component: 'Applies immediately on click; no Apply step.'}}},
} satisfies Meta<typeof SingleSelectFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The applied trigger reads `Genre: Rock`. */
export const WithSelection: Story = {args: {value: 'Rock'}};

/** Re-selecting the active option can't clear it — the filter always holds a value. */
export const Required: Story = {args: {value: 'Pop', isClearable: false}};
