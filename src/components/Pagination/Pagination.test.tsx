import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Pagination} from './Pagination.tsx';

describe('Pagination slot props (guardrails)', () => {
  it('lets a consumer relabel an arrow but keeps navigation working', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const consumerClick = vi.fn();
    render(
      <Pagination
        page={2}
        totalPages={4}
        onPageChange={onPageChange}
        // Consumer overrides the label and adds their own onClick...
        nextButtonProps={{label: 'Go forward', onClick: consumerClick, 'data-testid': 'next'}}
      />,
    );

    // ...the relabel and data attribute pass through,
    const next = screen.getByRole('button', {name: 'Go forward'});
    expect(next).toHaveAttribute('data-testid', 'next');

    // ...but the component's navigation onClick is the guardrail that wins.
    await user.click(next);
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(consumerClick).not.toHaveBeenCalled();
  });

  it('keeps the bounds guardrail — disabled on the first/last page regardless of slot props', () => {
    render(
      <Pagination
        page={1}
        totalPages={4}
        onPageChange={() => {}}
        prevButtonProps={{disabled: false}}
      />,
    );
    // The consumer tried to force-enable prev on page 1; the guardrail re-disables it.
    expect(screen.getByRole('button', {name: 'Previous page'})).toBeDisabled();
  });
});
