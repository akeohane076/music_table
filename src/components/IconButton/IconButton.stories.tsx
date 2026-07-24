import type {Meta, StoryObj} from '@storybook/react-vite';
import {IconButton} from './IconButton.tsx';
import {ChevronLeftIcon, CloseIcon} from '../Icon/index.ts';

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  args: {icon: <CloseIcon size="sm" />, label: 'Clear', variant: 'subtle', size: 'md'},
  argTypes: {
    variant: {control: 'inline-radio', options: ['ghost', 'subtle', 'plain']},
    size: {control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg']},
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The search clear affordance. */
export const Subtle: Story = {};

/** A pagination arrow — muted when disabled, accent on hover. */
export const Ghost: Story = {
  args: {icon: <ChevronLeftIcon size="md" />, label: 'Previous page', variant: 'ghost', size: 'sm'},
};

export const Disabled: Story = {
  args: {icon: <ChevronLeftIcon size="md" />, label: 'Previous page', variant: 'ghost', size: 'sm', disabled: true},
};

export const Sizes: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <IconButton key={size} icon={<CloseIcon size="sm" />} label={`Close ${size}`} variant="subtle" size={size} />
      ))}
    </div>
  ),
};
