import * as stylex from '@stylexjs/stylex';
import {ChevronLeftIcon, ChevronRightIcon, SortArrowIcon} from '../icons.tsx';
import {color, font, radius, size, space, text} from '../../theme/tokens.stylex.ts';
import type {Track} from '../../data/tracks.ts';
import type {Sort, SortColumn} from '../../lib/filtering.ts';

export interface TrackTableProps {
  readonly rows: readonly Track[];
  readonly sort: Sort;
  readonly onSort: (column: SortColumn) => void;
  readonly page: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

const styles = stylex.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingInline: space.lg,
    paddingBlock: space.lg,
  },
  scroller: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    minWidth: '640px',
    borderCollapse: 'collapse',
    fontFamily: font.family,
  },
  // Column proportions measured from the design's 1200px content width.
  colTitle: {width: '26.4%'},
  colArtist: {width: '28.8%'},
  headerCell: {
    height: size.rowHeight,
    paddingInline: 0,
    textAlign: 'start',
    verticalAlign: 'middle',
    fontSize: text.columnHeaderSize,
    lineHeight: text.columnHeaderLine,
    fontWeight: text.columnHeaderWeight,
    color: color.textPrimary,
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: color.border,
    whiteSpace: 'nowrap',
  },
  sortButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontWeight: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
    outlineOffset: '2px',
  },
  // Inactive columns keep the arrow at the muted grey the design uses.
  sortArrow: {
    color: color.iconMuted,
    transitionProperty: 'transform, color',
    transitionDuration: '150ms',
    '@media (prefers-reduced-motion: reduce)': {transitionDuration: '0ms'},
  },
  sortArrowActive: {
    color: color.textPrimary,
  },
  sortArrowDesc: {
    transform: 'scaleY(-1)',
  },
  cell: {
    height: size.rowHeight,
    paddingInline: 0,
    verticalAlign: 'middle',
    fontSize: text.cellSize,
    fontWeight: text.cellWeight,
    color: color.textPrimary,
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: color.border,
  },
  empty: {
    height: '160px',
    textAlign: 'center',
    fontSize: text.optionSize,
    color: color.textMuted,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: space.sm,
    paddingBlockStart: space.md,
  },
  pageLabel: {
    fontSize: text.paginationSize,
    lineHeight: text.paginationLine,
    fontWeight: text.paginationWeight,
    color: color.textPrimary,
    minWidth: '52px',
    textAlign: 'center',
  },
  pageButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size.icon,
    height: size.icon,
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    color: color.iconMuted,
    cursor: 'pointer',
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
    outlineOffset: '2px',
  },
  pageButtonEnabled: {
    color: {default: color.textPrimary, ':hover': color.accent},
  },
  pageButtonDisabled: {
    cursor: 'not-allowed',
  },
});

const SORTABLE: ReadonlySet<string> = new Set<SortColumn>(['title', 'artist']);

const COLUMNS = [
  {key: 'title', label: 'Title'},
  {key: 'artist', label: 'Artist'},
  {key: 'genre', label: 'Genre'},
] as const;

export function TrackTable({rows, sort, onSort, page, totalPages, onPageChange}: TrackTableProps) {
  return (
    <div {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.scroller)}>
        <table {...stylex.props(styles.table)}>
          <colgroup>
            <col {...stylex.props(styles.colTitle)} />
            <col {...stylex.props(styles.colArtist)} />
            <col />
          </colgroup>
          <thead>
            <tr>
              {COLUMNS.map(({key, label}) => {
                const isSortable = SORTABLE.has(key);
                const isActive = sort.column === key;
                return (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                    {...stylex.props(styles.headerCell)}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(key as SortColumn)}
                        {...stylex.props(styles.sortButton)}
                      >
                        {label}
                        <SortArrowIcon
                          size={20}
                          {...stylex.props(
                            styles.sortArrow,
                            isActive && styles.sortArrowActive,
                            isActive && sort.direction === 'desc' && styles.sortArrowDesc,
                          )}
                        />
                      </button>
                    ) : (
                      label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} {...stylex.props(styles.cell, styles.empty)}>
                  No songs match your filters.
                </td>
              </tr>
            ) : (
              rows.map((track) => (
                <tr key={track.id}>
                  <td {...stylex.props(styles.cell)}>{track.title}</td>
                  <td {...stylex.props(styles.cell)}>{track.artist}</td>
                  <td {...stylex.props(styles.cell)}>{track.genre}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav aria-label="Pagination" {...stylex.props(styles.footer)}>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          {...stylex.props(styles.pageButton, page > 1 ? styles.pageButtonEnabled : styles.pageButtonDisabled)}
        >
          <ChevronLeftIcon size={20} />
        </button>
        <span aria-live="polite" {...stylex.props(styles.pageLabel)}>
          {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          {...stylex.props(
            styles.pageButton,
            page < totalPages ? styles.pageButtonEnabled : styles.pageButtonDisabled,
          )}
        >
          <ChevronRightIcon size={20} />
        </button>
      </nav>
    </div>
  );
}
