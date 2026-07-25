import {describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {SingleSelectFilter} from './SingleSelectFilter.tsx';
import {toOptions} from '../types.ts';

const GENRES = toOptions(['Hip-Hop', 'Pop', 'Rock']);

// Each selection closes the menu, and Astryx's popover can't be reopened under jsdom, so
// these cover the single-open behaviour; the re-select-to-clear flow (which needs a reopen)
// is covered by the Playwright suite.
describe('SingleSelectFilter', () => {
  it('commits a choice immediately (uncontrolled, no value prop)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SingleSelectFilter label="Genre" options={GENRES} onChange={onChange} />);

    const trigger = screen.getByRole('button', {name: /^Genre/});
    expect(trigger).toHaveTextContent('Genre');

    await user.click(trigger);
    await user.click(screen.getByRole('menuitemradio', {name: 'Rock'}));

    // No `value` wired — the component holds the selection itself and the trigger updates.
    expect(onChange).toHaveBeenCalledWith('Rock');
    expect(trigger).toHaveTextContent('Genre: Rock');
  });

  it('moves through menu items with arrow keys, wrapping at the ends', async () => {
    const user = userEvent.setup();
    render(<SingleSelectFilter label="Genre" options={GENRES} />);

    await user.click(screen.getByRole('button', {name: /^Genre/}));
    const items = screen.getAllByRole('menuitemradio');
    // Astryx autofocuses the first focusable element asynchronously after open; wait for
    // it to settle rather than racing it with a manual focus().
    await waitFor(() => expect(items[0]).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    // Wrapped past the last item back to the first.
    expect(items[0]).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(items[2]).toHaveFocus();
  });

  it('honors defaultValue and keeps the value when isClearable is false', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SingleSelectFilter
        label="Genre"
        options={GENRES}
        defaultValue="Pop"
        isClearable={false}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole('button', {name: /^Genre/});
    expect(trigger).toHaveTextContent('Genre: Pop');

    await user.click(trigger);
    await user.click(screen.getByRole('menuitemradio', {name: 'Pop'}));

    // Re-selecting the active option keeps it, since clearing is disabled.
    expect(onChange).toHaveBeenLastCalledWith('Pop');
    expect(trigger).toHaveTextContent('Genre: Pop');
  });
});
