import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {IconButton, type IconButtonProps} from '../IconButton/index.ts';
import {ChevronLeftIcon, ChevronRightIcon} from '../Icon/index.ts';
import {styles} from '../../theme/componentStyles.ts';
import {mergeSlot, type Slot} from '../../lib/slotProps.ts';

/** Slot props for the arrow buttons — spread over the defaults, so callers can override
 * icons, labels, or styling per side. `onClick`/`disabled` stay a guardrail (see below). */
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
  readonly rootProps?: Slot<'nav'>;
  readonly labelProps?: Slot<'span'>;
}

/**
 * Generic pagination control — knows nothing about what it paginates. Renders two
 * `IconButton` arrows and a live-region label.
 *
 * `prevButtonProps`/`nextButtonProps` spread onto the arrows *before* the navigation
 * `onClick`/`disabled`, so a consumer can relabel or restyle an arrow but can't break the
 * paging behaviour or the bounds — composition with a guardrail. `rootProps`/`labelProps`
 * target the nav and the label.
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
  rootProps,
  labelProps,
}: PaginationProps) {
  return (
    <nav
      {...mergeSlot(rootProps, {'aria-label': label, ...stylex.props(styles.pagination.root, xstyle)})}
    >
      <IconButton
        icon={<ChevronLeftIcon size="md" />}
        label="Previous page"
        variant="ghost"
        size="sm"
        {...prevButtonProps}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      />
      <span {...mergeSlot(labelProps, {'aria-live': 'polite' as const, ...stylex.props(styles.pagination.label)})}>
        {renderLabel ? renderLabel(page, totalPages) : `${page} of ${totalPages}`}
      </span>
      <IconButton
        icon={<ChevronRightIcon size="md" />}
        label="Next page"
        variant="ghost"
        size="sm"
        {...nextButtonProps}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      />
    </nav>
  );
}
