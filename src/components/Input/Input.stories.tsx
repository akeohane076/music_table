import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Input} from './Input.tsx';
import {SearchIcon} from '../Icon/index.ts';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  args: {placeholder: 'Type here', label: 'Example input'},
  argTypes: {variant: {control: 'inline-radio', options: ['boxed', 'plain']}},
  render: (args) => {
    const [value, setValue] = useState(args.value ?? '');
    return (
      <div style={{width: 320}}>
        <Input {...args} value={value} onChange={setValue} />
      </div>
    );
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Boxed: Story = {};

export const WithStartIcon: Story = {args: {startIcon: <SearchIcon size="md" />, placeholder: 'Search'}};

/** No surface/border — for use inside a container that supplies the chrome. */
export const Plain: Story = {
  args: {variant: 'plain', startIcon: <SearchIcon size="md" />, placeholder: 'Search'},
  decorators: [
    (Story) => (
      <div style={{background: '#fff', border: '1px solid #E0E0E0', borderRadius: 4}}>
        <Story />
      </div>
    ),
  ],
};

/** Uncontrolled: the Input owns its value from `defaultValue` (no value/onChange wired). */
export const Uncontrolled: Story = {
  render: () => (
    <div style={{width: 320}}>
      <Input defaultValue="I manage my own state" label="Uncontrolled" />
    </div>
  ),
};
