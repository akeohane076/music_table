import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Pagination} from './Pagination.tsx';

const meta = {
  title: 'Data/Pagination',
  component: Pagination,
  args: {page: 1, totalPages: 4, onPageChange: () => {}},
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LastPage: Story = {args: {page: 4, totalPages: 4}};

/** A custom label via `renderLabel`. */
export const CustomLabel: Story = {
  args: {page: 2, renderLabel: (page, total) => `Page ${page} / ${total}`},
};

/** Slot props: `nextButtonProps` / `prevButtonProps` spread onto the arrow IconButtons —
 * here to relabel them without a dedicated prop. */
export const SlotProps: Story = {
  args: {
    prevButtonProps: {label: 'Go back'},
    nextButtonProps: {label: 'Go forward'},
  },
};
