import {useState} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MultiSelectFilter} from './MultiSelectFilter.tsx';
import {toOptions} from '../types.ts';

const OPTIONS = toOptions(['ABBA', 'Billie Eilish', 'Jimi Hendrix', 'Kendrick Lamar', 'Led Zeppelin']);

function Harness({onChange, initial = []}: {onChange?: (v: readonly string[]) => void; initial?: string[]}) {
  const [value, setValue] = useState<readonly string[]>(initial);
  return (
    <>
      <MultiSelectFilter
        label="Artist"
        options={OPTIONS}
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange?.(next);
        }}
        searchPlaceholder="Search Artists"
      />
      {/* Stands in for the selection being changed elsewhere on the page. */}
      <button type="button" onClick={() => setValue(['ABBA', 'Led Zeppelin'])}>
        set externally
      </button>
    </>
  );
}

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', {name: /^Artist/}));
  return screen.findByRole('dialog');
};

describe('MultiSelectFilter', () => {
  it('labels the trigger with the committed count, not the draft', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', {name: /^Artist/});
    expect(trigger).toHaveTextContent('Artist');

    const panel = await openPanel(user);
    await user.click(within(panel).getByRole('checkbox', {name: 'ABBA'}));

    // Draft moved; the trigger and therefore the page have not.
    expect(within(panel).getByText('Selected (1)')).toBeInTheDocument();
    expect(trigger).toHaveTextContent(/^Artist$/);
  });

  it('commits the draft only when Apply is pressed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    const panel = await openPanel(user);
    await user.click(within(panel).getByRole('checkbox', {name: 'ABBA'}));
    await user.click(within(panel).getByRole('checkbox', {name: 'Led Zeppelin'}));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(within(panel).getByRole('button', {name: 'Apply'}));
    expect(onChange).toHaveBeenCalledWith(['ABBA', 'Led Zeppelin']);
    expect(screen.getByRole('button', {name: /^Artist/})).toHaveTextContent('Artist (2)');
  });

  it('discards the draft when dismissed with Escape', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} initial={['ABBA']} />);

    const panel = await openPanel(user);
    await user.click(within(panel).getByRole('checkbox', {name: 'Billie Eilish'}));
    await user.keyboard('{Escape}');

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', {name: /^Artist/})).toHaveTextContent('Artist (1)');
  });

  /**
   * Astryx's popover cannot be reopened under jsdom — the second trigger click never
   * flips `aria-expanded`, because the component leans on CSS anchor positioning that
   * jsdom does not implement. Reopening works correctly in a real browser, so the
   * seeding effect is exercised here with a single open against an externally changed
   * value instead of an open/close/open cycle.
   */
  it('seeds the draft from the committed value when it opens', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['ABBA']} />);

    await user.click(screen.getByRole('button', {name: 'set externally'}));
    const panel = await openPanel(user);

    expect(within(panel).getByText('Selected (2)')).toBeInTheDocument();
    expect(within(panel).getByRole('checkbox', {name: 'ABBA'})).toBeChecked();
    expect(within(panel).getByRole('checkbox', {name: 'Led Zeppelin'})).toBeChecked();
    expect(within(panel).getByRole('checkbox', {name: 'Billie Eilish'})).not.toBeChecked();
  });

  it('empties the draft on Clear All without committing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} initial={['ABBA', 'Led Zeppelin']} />);

    const panel = await openPanel(user);
    await user.click(within(panel).getByRole('button', {name: 'Clear All'}));

    expect(within(panel).getByText('Selected (0)')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', {name: /^Artist/})).toHaveTextContent('Artist (2)');
  });

  it('filters the options by its own search without touching the selection', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['ABBA']} />);

    const panel = await openPanel(user);
    await user.type(within(panel).getByPlaceholderText('Search Artists'), 'led');

    expect(within(panel).getByRole('checkbox', {name: 'Led Zeppelin'})).toBeInTheDocument();
    expect(within(panel).queryByRole('checkbox', {name: 'Jimi Hendrix'})).not.toBeInTheDocument();
    // A hidden option stays selected — search narrows the list, not the draft.
    expect(within(panel).getByText('Selected (1)')).toBeInTheDocument();
  });

  it('removes a selection from the Selected column', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['ABBA', 'Led Zeppelin']} />);

    const panel = await openPanel(user);
    await user.click(within(panel).getByRole('button', {name: 'Remove ABBA'}));

    expect(within(panel).getByText('Selected (1)')).toBeInTheDocument();
    expect(within(panel).getByRole('checkbox', {name: 'ABBA'})).not.toBeChecked();
  });

  it('renders custom option content while the checkbox machinery keeps working', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectFilter
        label="Artist"
        options={OPTIONS}
        defaultValue={[]}
        renderOptionLabel={(option, {checked}) => (
          <span data-testid={`opt-${option.value}`}>
            {option.label} {checked ? '✓' : ''}
          </span>
        )}
      />,
    );
    const panel = await openPanel(user);

    // Custom content renders, and the row is still a real, toggleable checkbox.
    expect(within(panel).getByTestId('opt-ABBA')).toHaveTextContent('ABBA');
    await user.click(within(panel).getByRole('checkbox', {name: /ABBA/}));
    expect(within(panel).getByRole('checkbox', {name: /ABBA/})).toBeChecked();
    expect(within(panel).getByTestId('opt-ABBA')).toHaveTextContent('✓');
  });

  it('uses a custom filterOption predicate for the in-menu search', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectFilter
        label="Artist"
        options={OPTIONS}
        defaultValue={[]}
        searchPlaceholder="Search Artists"
        // Prefix-only matching: "led" matches Led Zeppelin but "eppelin" must not.
        filterOption={(option, q) => option.label.toLowerCase().startsWith(q)}
      />,
    );
    const panel = await openPanel(user);
    await user.type(within(panel).getByPlaceholderText('Search Artists'), 'eppelin');

    expect(within(panel).queryByRole('checkbox', {name: 'Led Zeppelin'})).not.toBeInTheDocument();
    expect(within(panel).getByText('No matches')).toBeInTheDocument();
  });

  it('guards the in-menu search: searchProps cannot detach it from filtering', async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectFilter
        label="Artist"
        options={OPTIONS}
        defaultValue={[]}
        // Consumer customises the placeholder but tries to hijack the value.
        searchProps={{placeholder: 'Find…', value: 'zzz', onChange: () => {}} as never}
      />,
    );
    const panel = await openPanel(user);
    const search = within(panel).getByPlaceholderText('Find…');

    // The filter's own value/onChange won: typing still narrows the list.
    await user.type(search, 'led');
    expect(within(panel).getByRole('checkbox', {name: 'Led Zeppelin'})).toBeInTheDocument();
    expect(within(panel).queryByRole('checkbox', {name: 'ABBA'})).not.toBeInTheDocument();
  });

  it('works uncontrolled from defaultValue — owns its committed state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // No `value` prop: the component tracks the committed selection itself.
    render(
      <MultiSelectFilter
        label="Artist"
        options={OPTIONS}
        defaultValue={['ABBA']}
        onChange={onChange}
        searchPlaceholder="Search Artists"
      />,
    );
    const trigger = screen.getByRole('button', {name: /^Artist/});
    expect(trigger).toHaveTextContent('Artist (1)');

    await user.click(trigger);
    const panel = await screen.findByRole('dialog');
    expect(within(panel).getByRole('checkbox', {name: 'ABBA'})).toBeChecked();
    await user.click(within(panel).getByRole('checkbox', {name: 'Led Zeppelin'}));
    await user.click(within(panel).getByRole('button', {name: 'Apply'}));

    expect(onChange).toHaveBeenCalledWith(['ABBA', 'Led Zeppelin']);
    // The trigger updates with no external value wired — proof it's self-controlled.
    expect(trigger).toHaveTextContent('Artist (2)');
  });
});
