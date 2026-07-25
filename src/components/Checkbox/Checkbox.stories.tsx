import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Checkbox} from './Checkbox.tsx';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  args: {children: 'Billie Eilish', checked: false, onChange: () => {}},
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <div style={{width: 240}}>
        <Checkbox {...args} checked={checked} onChange={setChecked} />
      </div>
    );
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = {args: {checked: true}};

export const List: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['ABBA']);
    const options = ['ABBA', 'Billie Eilish', 'Jimi Hendrix', 'Kendrick Lamar'];
    return (
      <div style={{width: 240}}>
        {options.map((name) => (
          <Checkbox
            key={name}
            checked={values.includes(name)}
            onChange={(next) =>
              setValues((v) => (next ? [...v, name] : v.filter((n) => n !== name)))
            }
          >
            {name}
          </Checkbox>
        ))}
      </div>
    );
  },
};
