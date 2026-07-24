import type {Meta, StoryObj} from '@storybook/react-vite';
import {FilterPill} from './FilterPill.tsx';

/**
 * The shared trigger both filters render. Documented on its own so the states — resting,
 * open, active — are visible in one place, since consistency across filters starts here.
 */
const meta = {
  title: 'Filters/Primitives/FilterPill',
  component: FilterPill,
  args: {label: 'Artist'},
} satisfies Meta<typeof FilterPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Resting: Story = {};

/** Caret rotates and the outline appears while the menu is open. */
export const Open: Story = {args: {isOpen: true}};

/** Active once the filter constrains results — e.g. `Artist (2)`. */
export const Active: Story = {args: {label: 'Artist (2)', isActive: true}};

export const AllStates: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
      <FilterPill label="Artist" />
      <FilterPill label="Artist" isOpen />
      <FilterPill label="Artist (2)" isActive />
      <FilterPill label="Genre: Rock" isActive />
    </div>
  ),
};
