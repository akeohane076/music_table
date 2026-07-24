import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {SearchInput} from './SearchInput.tsx';

const meta = {
  title: 'Filters/SearchInput',
  component: SearchInput,
  args: {placeholder: 'Search by title, artist or genre', label: 'Search songs', value: '', onChange: () => {}},
  // Controlled component: wire value/onChange to local state so the stories are interactive.
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '');
    return (
      <div style={{width: 320}}>
        <SearchInput {...args} value={value} onChange={setValue} />
      </div>
    );
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = {args: {value: 'abba'}};

/** No surface or border — for use inside a popover row (as the artist filter does). */
export const Plain: Story = {
  args: {value: 'led', variant: 'plain'},
  decorators: [
    (Story) => (
      <div style={{background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4, width: 260}}>
        <Story />
      </div>
    ),
  ],
};

export const NotClearable: Story = {args: {value: 'rock', isClearable: false}};
