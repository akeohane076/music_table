import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
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
