import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {IconButton, type IconButtonProps} from '../IconButton/index.ts';
import {ChevronLeftIcon, ChevronRightIcon} from '../Icon/index.ts';
import {styles} from '../../theme/componentStyles.ts';

/** Slot props for the arrow buttons — spread over the defaults, so callers can override
 * icons, labels, styling, or behaviour per side. `icon`/`label` are optional here since
 * Pagination supplies sensible defaults. */
type ArrowProps = Partial<Omit<IconButtonProps, 'ref'>>;

export interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  /** Customise the middle label. Defaults to `{page} of {totalPages}`. */
  readonly renderLabel?: (page: number, totalPages: number) => ReactNode;
  readonly prevButtonProps?: ArrowProps;
  readonly nextButtonProps?: ArrowProps;
  readonly label?: string;
  readonly xstyle?: stylex.StyleXStyles;
}

/**
 * Generic pagination control — knows nothing about what it paginates. Renders two
 * `IconButton` arrows and a live-region label. `prevButtonProps` / `nextButtonProps` spread
 * onto the arrows after the defaults, so a consumer can swap an icon, retarget the click, or
 * add attributes without a new prop for each case.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  renderLabel,
  prevButtonProps,
  nextButtonProps,
  label = 'Pagination',
  xstyle,
}: PaginationProps) {
  return (
    <nav aria-label={label} {...stylex.props(styles.pagination.root, xstyle)}>
      <IconButton
        icon={<ChevronLeftIcon size="md" />}
        label="Previous page"
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        {...prevButtonProps}
      />
      <span aria-live="polite" {...stylex.props(styles.pagination.label)}>
        {renderLabel ? renderLabel(page, totalPages) : `${page} of ${totalPages}`}
      </span>
      <IconButton
        icon={<ChevronRightIcon size="md" />}
        label="Next page"
        variant="ghost"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        {...nextButtonProps}
      />
    </nav>
  );
}
