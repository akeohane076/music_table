import type {Meta, StoryObj} from '@storybook/react-vite';
import {ButtonBar} from './ButtonBar.tsx';
import {Button} from '../Button/index.ts';

const meta = {
  title: 'Primitives/ButtonBar',
  component: ButtonBar,
  args: {children: null},
  argTypes: {align: {control: 'inline-radio', options: ['start', 'center', 'end', 'between']}},
  render: (args) => (
    <div style={{width: 320}}>
      <ButtonBar {...args}>
        <Button variant="outline" size="sm">
          Clear All
        </Button>
        <Button variant="solid" size="sm">
          Apply
        </Button>
      </ButtonBar>
    </div>
  ),
} satisfies Meta<typeof ButtonBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The menu footer default — actions on the right. */
export const End: Story = {args: {align: 'end'}};
export const Between: Story = {args: {align: 'between'}};
