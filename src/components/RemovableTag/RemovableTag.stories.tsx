import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {RemovableTag} from './RemovableTag.tsx';

const meta = {
  title: 'Primitives/RemovableTag',
  component: RemovableTag,
  args: {children: 'Billie Eilish', removeLabel: 'Remove Billie Eilish', onRemove: () => {}},
  render: (args) => (
    <div style={{width: 240}}>
      <RemovableTag {...args} onRemove={() => {}} />
    </div>
  ),
} satisfies Meta<typeof RemovableTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A removable list — the shape of the multi-select's Selected column. */
export const List: Story = {
  render: () => {
    const [items, setItems] = useState(['Billie Eilish', 'Kendrick Lamar', 'ABBA']);
    return (
      <div style={{width: 240}}>
        {items.map((name) => (
          <RemovableTag
            key={name}
            removeLabel={`Remove ${name}`}
            onRemove={() => setItems((cur) => cur.filter((n) => n !== name))}
          >
            {name}
          </RemovableTag>
        ))}
      </div>
    );
  },
};
