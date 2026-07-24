import type {ComponentPropsWithoutRef, ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {Button} from '../Button/index.ts';
import {SortArrowIcon} from '../Icon/index.ts';
import {styles} from '../../theme/componentStyles.ts';

export type SortDirection = 'asc' | 'desc';

export interface TableSort {
  readonly columnId: string;
  readonly direction: SortDirection;
}

export interface Column<T> {
  /** Stable id, used as the sort key and React key. */
  readonly id: string;
  readonly header: ReactNode;
  readonly cell: (row: T) => ReactNode;
  readonly sortable?: boolean;
  /** CSS width applied via `<col>` (e.g. "26.4%"). */
  readonly width?: string;
  readonly align?: 'start' | 'end' | 'center';
}

export interface TableProps<T> {
  readonly columns: readonly Column<T>[];
  readonly rows: readonly T[];
  readonly getRowId: (row: T) => string;
  /** Active sort. Omit for an unsorted table. */
  readonly sort?: TableSort;
  /** Fired when a sortable header is activated, with that column's id. */
  readonly onSortChange?: (columnId: string) => void;
  /** Rendered (spanning all columns) when `rows` is empty. */
  readonly emptyState?: ReactNode;
  readonly minWidth?: string;
  readonly label?: string;
  /** Spread onto the `<table>` element. */
  readonly tableProps?: ComponentPropsWithoutRef<'table'>;
}

const alignStyle = {end: styles.table.alignEnd, center: styles.table.alignCenter, start: null} as const;

/**
 * Generic data table. Columns declare how to render and (optionally) sort each field, so
 * the component is decoupled from any particular row shape — the songs page passes
 * `Column<Track>[]`, but the same `Table` serves any `T`.
 */
export function Table<T>({
  columns,
  rows,
  getRowId,
  sort,
  onSortChange,
  emptyState,
  minWidth = '640px',
  label,
  tableProps,
}: TableProps<T>) {
  return (
    <div {...stylex.props(styles.table.scroller)}>
      <table
        aria-label={label}
        {...tableProps}
        {...stylex.props(styles.table.root)}
        style={{minWidth, ...tableProps?.style}}
      >
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} style={column.width ? {width: column.width} : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => {
              const isActive = sort?.columnId === column.id;
              const align = alignStyle[column.align ?? 'start'];
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                  {...stylex.props(styles.table.headerCell, align)}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      xstyle={styles.table.sortTrigger}
                      onClick={() => onSortChange?.(column.id)}
                      endIcon={
                        <SortArrowIcon
                          size="md"
                          className={
                            stylex.props(
                              styles.table.sortArrow,
                              isActive && styles.table.sortArrowActive,
                              isActive && sort.direction === 'desc' && styles.table.sortArrowDesc,
                            ).className
                          }
                        />
                      }
                    >
                      {column.header}
                    </Button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} {...stylex.props(styles.table.cell, styles.table.empty)}>
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowId(row)}>
                {columns.map((column) => (
                  <td
                    key={column.id}
                    {...stylex.props(styles.table.cell, alignStyle[column.align ?? 'start'])}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
