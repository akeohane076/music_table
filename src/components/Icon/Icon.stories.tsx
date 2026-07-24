import type {Meta, StoryObj} from '@storybook/react-vite';
import {
  CheckIcon,
  ChevronIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ICON_SIZE,
  SearchIcon,
  SortArrowIcon,
} from './Icon.tsx';

const GLYPHS = {SearchIcon, CloseIcon, ChevronIcon, SortArrowIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon};

const meta = {
  title: 'Primitives/Icon',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every glyph in the set at the default (`md`) size. */
export const Glyphs: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap'}}>
      {Object.entries(GLYPHS).map(([name, Glyph]) => (
        <div key={name} style={{display: 'grid', placeItems: 'center', gap: 6, width: 72}}>
          <Glyph size="md" />
          <span style={{fontSize: 11, color: '#757575'}}>{name.replace('Icon', '')}</span>
        </div>
      ))}
    </div>
  ),
};

/** The t-shirt size ramp (xs → xl) plus a numeric escape hatch. */
export const Sizes: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 24, alignItems: 'flex-end'}}>
      {(Object.keys(ICON_SIZE) as (keyof typeof ICON_SIZE)[]).map((size) => (
        <div key={size} style={{display: 'grid', placeItems: 'center', gap: 6}}>
          <SearchIcon size={size} />
          <span style={{fontSize: 11, color: '#757575'}}>
            {size} · {ICON_SIZE[size]}px
          </span>
        </div>
      ))}
    </div>
  ),
};
