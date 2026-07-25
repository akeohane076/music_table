import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {RemovableTag} from './RemovableTag.tsx';

describe('RemovableTag', () => {
  it('renders the label and a titled remove button', () => {
    render(
      <RemovableTag onRemove={() => {}} removeLabel="Remove Billie Eilish">
        Billie Eilish
      </RemovableTag>,
    );
    expect(screen.getByText('Billie Eilish')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Remove Billie Eilish'})).toBeInTheDocument();
  });

  it('calls onRemove when the × is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <RemovableTag onRemove={onRemove} removeLabel="Remove Billie Eilish">
        Billie Eilish
      </RemovableTag>,
    );
    await user.click(screen.getByRole('button', {name: 'Remove Billie Eilish'}));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('keeps onRemove wired even when removeButtonProps tries to override onClick', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const consumerClick = vi.fn();
    render(
      <RemovableTag
        onRemove={onRemove}
        removeLabel="Remove"
        removeButtonProps={{onClick: consumerClick}}
      >
        Item
      </RemovableTag>,
    );
    await user.click(screen.getByRole('button', {name: 'Remove'}));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(consumerClick).not.toHaveBeenCalled();
  });
});
