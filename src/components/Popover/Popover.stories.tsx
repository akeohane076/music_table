import type {Meta, StoryObj} from '@storybook/react-vite';
import {Popover} from './Popover.tsx';
import {Button} from '../Button/index.ts';
import {ButtonBar} from '../ButtonBar/index.ts';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  args: {children: null},
  parameters: {
    docs: {
      description: {
        component:
          'Generic compound popover: <Popover><Popover.Trigger/><Popover.Content/></Popover>. ' +
          'The trigger and content are children sharing open/close state via context.',
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Popover label="Example">
      <Popover.Trigger>
        <Button variant="outline">Open menu</Button>
      </Popover.Trigger>
      <Popover.Content>
        {({close}) => (
          <div style={{background: '#fff', borderRadius: 4, boxShadow: '0 0 16px rgba(0,0,0,.2)', width: 260}}>
            <div style={{padding: 16}}>Anything can go in the content.</div>
            <ButtonBar>
              <Button variant="solid" size="sm" onClick={close}>
                Done
              </Button>
            </ButtonBar>
          </div>
        )}
      </Popover.Content>
    </Popover>
  ),
};
