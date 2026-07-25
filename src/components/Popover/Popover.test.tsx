import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Popover, usePopover} from './Popover.tsx';

/**
 * A trigger that reflects the popover's open state, proving the context is shared. Like any
 * Popover trigger, it forwards the injected anchor props (ref/onClick/ARIA) to its button.
 */
function StateTrigger({children, ...rest}: React.ComponentPropsWithRef<'button'>) {
  const {isOpen} = usePopover();
  return (
    <button data-open={isOpen} {...rest}>
      {children}
    </button>
  );
}

describe('Popover (compound)', () => {
  it('wires the trigger, shares state via context, and opens/closes the content', async () => {
    const user = userEvent.setup();
    render(
      <Popover label="Test">
        <Popover.Trigger>
          <StateTrigger>Open</StateTrigger>
        </Popover.Trigger>
        <Popover.Content>
          {({close}) => (
            <div>
              <p>Panel body</p>
              <button onClick={close}>Done</button>
            </div>
          )}
        </Popover.Content>
      </Popover>,
    );

    const trigger = screen.getByRole('button', {name: 'Open'});
    // The trigger got Astryx's ARIA wiring and reflects the shared open state (via context).
    // Open/close is asserted through `data-open` — Astryx keeps the content mounted and hides
    // it with StyleX classes jsdom can't evaluate, so DOM presence isn't a reliable signal.
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('data-open', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('Panel body')).toBeInTheDocument();

    // The content's `close` (from context) dismisses it.
    await user.click(screen.getByRole('button', {name: 'Done'}));
    expect(trigger).toHaveAttribute('data-open', 'false');
  });
});
