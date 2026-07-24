import type {CSSProperties, ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {styles} from '../../theme/componentStyles.ts';

/**
 * Icon primitive. Wraps an SVG glyph so every icon in the system shares one sizing
 * contract, inherits `currentColor`, and is hidden from assistive tech by default
 * (icons are decorative; the interactive element carries the label).
 *
 * The Figma uses Material Symbols glyphs (their `*_24dp_*` layer names) plus Polaris
 * chevrons for pagination. Glyphs are inlined so the page pulls no icon font.
 */

/** T-shirt scale (px). `sm`/`md` cover the design's chevron/search-and-sort sizes. */
export const ICON_SIZE = {xs: 12, sm: 16, md: 20, lg: 24, xl: 32} as const;

export type IconSize = keyof typeof ICON_SIZE | number;

export interface IconProps {
  /** T-shirt token or an explicit pixel number for one-off sizes (e.g. the 14px check). */
  readonly size?: IconSize;
  /** Accepts the output of `stylex.props()` for contextual color/transform. */
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function resolveIconSize(size: IconSize = 'md'): number {
  return typeof size === 'number' ? size : ICON_SIZE[size];
}

function Glyph({
  size = 'md',
  className,
  style,
  viewBox = '0 0 24 24',
  children,
}: IconProps & {viewBox?: string; children: ReactNode}) {
  const px = resolveIconSize(size);
  const base = stylex.props(styles.icon.base);
  // `className` arrives as an already-compiled StyleX class string from the caller
  // (e.g. the caret-rotation or sort-color styles), so it's concatenated rather than
  // fed back through stylex.props.
  return (
    <svg
      width={px}
      height={px}
      viewBox={viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className ? `${base.className} ${className}` : base.className}
      style={{...base.style, ...style}}
    >
      {children}
    </svg>
  );
}

export function SearchIcon({size = 'md', ...rest}: IconProps) {
  return (
    <Glyph size={size} {...rest}>
      <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
    </Glyph>
  );
}

export function CloseIcon({size = 'sm', ...rest}: IconProps) {
  return (
    <Glyph size={size} {...rest}>
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
    </Glyph>
  );
}

/** Caret on the filter buttons. Rotates 180° when its popover is open. */
export function ChevronIcon({size = 'sm', ...rest}: IconProps) {
  return (
    <Glyph size={size} viewBox="0 0 16 16" {...rest}>
      <path d="M8 10.2 4.4 6.6l1.06-1.06L8 8.08l2.54-2.54L11.6 6.6 8 10.2Z" />
    </Glyph>
  );
}

/**
 * Sort affordance on Title and Artist — Material's thin `arrow_downward_alt`
 * (~10×11 glyph in the 20px frame). Flips vertically for descending order.
 */
export function SortArrowIcon({size = 'md', ...rest}: IconProps) {
  return (
    <Glyph size={size} {...rest}>
      <path d="M11.1 5h1.8v9.5l3.6-3.6 1.27 1.27-5.77 5.77-5.77-5.77 1.27-1.27 3.6 3.6z" />
    </Glyph>
  );
}

export function ChevronLeftIcon({size = 'md', ...rest}: IconProps) {
  return (
    <Glyph size={size} {...rest}>
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
    </Glyph>
  );
}

export function ChevronRightIcon({size = 'md', ...rest}: IconProps) {
  return (
    <Glyph size={size} {...rest}>
      <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
    </Glyph>
  );
}

/** Tick inside a checked checkbox. */
export function CheckIcon({size = 'sm', ...rest}: IconProps) {
  return (
    <Glyph size={size} {...rest}>
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" />
    </Glyph>
  );
}
