import type {CSSProperties, ReactNode} from 'react';

/**
 * The design uses Material Symbols glyphs (the Figma layer names carry their
 * `*_24dp_*` filenames) plus Polaris chevrons for pagination. Inlined as SVG so the
 * page pulls no icon font and each glyph inherits `currentColor`.
 */
export interface IconProps {
  readonly size?: number;
  /** Accepts the output of `stylex.props()`. */
  readonly className?: string;
  readonly style?: CSSProperties;
}

function Svg({
  size,
  className,
  style,
  viewBox = '0 0 24 24',
  children,
}: IconProps & {viewBox?: string; children: ReactNode}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
}

export function SearchIcon({size = 20, ...rest}: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
    </Svg>
  );
}

export function CloseIcon({size = 16, ...rest}: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
    </Svg>
  );
}

/** Caret on the filter buttons. Rotates 180° when its popover is open. */
export function ChevronIcon({size = 16, ...rest}: IconProps) {
  return (
    <Svg size={size} viewBox="0 0 16 16" {...rest}>
      <path d="M8 10.2 4.4 6.6l1.06-1.06L8 8.08l2.54-2.54L11.6 6.6 8 10.2Z" />
    </Svg>
  );
}

/** Sort affordance on Title and Artist. Flips vertically for descending order. */
export function SortArrowIcon({size = 20, ...rest}: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8Z" />
    </Svg>
  );
}

export function ChevronLeftIcon({size = 20, ...rest}: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
    </Svg>
  );
}

export function ChevronRightIcon({size = 20, ...rest}: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6Z" />
    </Svg>
  );
}

/** Tick inside a checked checkbox. */
export function CheckIcon({size = 16, ...rest}: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" />
    </Svg>
  );
}
