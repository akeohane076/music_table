import {useState} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Checkbox} from './Checkbox.tsx';

describe('Checkbox', () => {
  it('renders a real checkbox with its label as the accessible name', () => {
    render(
      <Checkbox checked={false} onChange={() => {}}>
        ABBA
      </Checkbox>,
    );
    expect(screen.getByRole('checkbox', {name: 'ABBA'})).not.toBeChecked();
  });

  it('reflects checked and reports the toggled value on change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={onChange}>
        ABBA
      </Checkbox>,
    );
    await user.click(screen.getByRole('checkbox', {name: 'ABBA'}));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles from the keyboard (label + native input)', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox checked={checked} onChange={setChecked}>
          ABBA
        </Checkbox>
      );
    }
    render(<Harness />);
    const box = screen.getByRole('checkbox', {name: 'ABBA'});
    box.focus();
    await user.keyboard(' ');
    expect(box).toBeChecked();
  });
});
