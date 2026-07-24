import * as stylex from '@stylexjs/stylex';
import {ChevronIcon} from '../icons.tsx';
import {color, font, radius, size, text} from '../../theme/tokens.stylex.ts';

/**
 * The trigger shared by every filter. Both filters render the same control, so the
 * one thing they must not disagree on — hit area, focus ring, active treatment —
 * is defined once here. Only the label text differs, and each filter owns the
 * formatting of its own label ("Artist (2)" vs "Genre: Rock").
 */
export interface FilterPillProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'ref' | 'children'> {
  readonly label: string;
  /** Drives the caret rotation and the active outline while open. */
  readonly isOpen?: boolean;
  /** True once the filter constrains the results — draws the dark outline. */
  readonly isActive?: boolean;
  /** Popover passes a callback ref for anchor positioning. */
  readonly ref?: (el: HTMLElement | null) => void;
}

const styles = stylex.create({
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    height: size.controlHeight,
    // Measured from the design: 14px before the label, 13px after the caret.
    paddingInline: '14px 13px',
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    // A transparent border is always present so the active state cannot shift layout.
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: 'transparent',
      ':hover': color.iconMuted,
    },
    color: color.textPrimary,
    fontFamily: font.family,
    fontSize: text.controlLabelSize,
    lineHeight: text.controlLabelLine,
    fontWeight: text.controlLabelWeight,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${color.accent}`,
    },
    outlineOffset: '2px',
  },
  active: {
    borderColor: color.borderStrong,
  },
  caret: {
    flexShrink: 0,
    transitionProperty: 'transform',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease',
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '0ms',
    },
  },
  caretOpen: {
    transform: 'rotate(180deg)',
  },
});

export function FilterPill({label, isOpen = false, isActive = false, ref, onClick, ...rest}: FilterPillProps) {
  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      {...rest}
      {...stylex.props(styles.pill, (isActive || isOpen) && styles.active)}
    >
      {label}
      <ChevronIcon size={16} {...stylex.props(styles.caret, isOpen && styles.caretOpen)} />
    </button>
  );
}
