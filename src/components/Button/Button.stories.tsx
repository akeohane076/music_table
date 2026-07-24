import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button} from './Button.tsx';
import {ChevronIcon} from '../Icon/index.ts';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: {children: 'Button', variant: 'solid', size: 'md'},
  argTypes: {
    variant: {control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'pill']},
    size: {control: 'inline-radio', options: ['sm', 'md', 'lg']},
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {args: {children: 'Apply', variant: 'solid', size: 'sm'}};
export const Outline: Story = {args: {children: 'Clear All', variant: 'outline', size: 'sm'}};
export const Ghost: Story = {args: {children: 'Ghost'}};

/** The filter trigger: pill shape, chevron end icon, active outline. */
export const Pill: Story = {
  args: {children: 'Artist (2)', variant: 'pill', isActive: true, endIcon: <ChevronIcon size="sm" />},
};

export const Variants: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
      <Button variant="solid" size="sm">Apply</Button>
      <Button variant="outline" size="sm">Clear All</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="pill" endIcon={<ChevronIcon size="sm" />}>Genre</Button>
      <Button variant="pill" isActive endIcon={<ChevronIcon size="sm" />}>Genre: Rock</Button>
    </div>
  ),
};

export const Disabled: Story = {args: {children: 'Disabled', disabled: true}};
