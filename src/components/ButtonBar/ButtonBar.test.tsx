import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ButtonBar} from './ButtonBar.tsx';
import {Button} from '../Button/index.ts';

describe('ButtonBar', () => {
  it('renders its buttons and spreads root props', () => {
    render(
      <ButtonBar data-testid="bar">
        <Button variant="outline" size="sm">
          Clear All
        </Button>
        <Button variant="solid" size="sm">
          Apply
        </Button>
      </ButtonBar>,
    );
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Clear All'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Apply'})).toBeInTheDocument();
  });
});
