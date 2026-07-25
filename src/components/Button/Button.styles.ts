import * as stylex from '@stylexjs/stylex';
import {color, font, radius, size, space, text} from '../../theme/tokens.stylex.ts';

/**
 * Button styles. `base` + one `size` + one `variant` compose into every button; the
 * `pill` variant overrides the size geometry with the filter-trigger's own measurements.
 */
export const button = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    boxSizing: 'border-box',
    // "Borders" are inset box-shadows, matching Figma's inside strokes: they never take
    // layout space, so a 40px pill is 40px and padding insets measure from the true edge.
    borderStyle: 'none',
    fontFamily: font.family,
    fontSize: text.controlLabelSize,
    lineHeight: text.controlLabelLine,
    fontWeight: text.controlLabelWeight,
    whiteSpace: 'nowrap',
    cursor: {default: 'pointer', ':disabled': 'not-allowed'},
    opacity: {default: 1, ':disabled': 0.5},
    outline: {default: 'none', ':focus-visible': `2px solid ${color.accent}`},
    outlineOffset: '2px',
  },

  // Sizes — height + inline padding + corner radius.
  sm: {height: '24px', paddingInline: space.md, borderRadius: radius.control},
  md: {height: size.controlHeight, paddingInline: space.lg, borderRadius: radius.control},
  lg: {height: '48px', paddingInline: space.xl, borderRadius: radius.control},

  // Variants — surface + text + inside-stroke.
  solid: {
    backgroundColor: color.accent,
    color: color.onAccent,
  },
  outline: {
    backgroundColor: {default: color.surface, ':hover': color.pageBg},
    boxShadow: `inset 0 0 0 1px ${color.accent}`,
    color: color.accent,
  },
  ghost: {
    backgroundColor: {default: 'transparent', ':hover': color.pageBg},
    color: color.textPrimary,
  },
  // The filter trigger: fully rounded, its own 14/13 padding, hover-reveals a stroke.
  pill: {
    height: size.controlHeight,
    paddingInline: '14px 13px',
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    boxShadow: {default: 'none', ':hover': `inset 0 0 0 1px ${color.iconMuted}`},
    color: color.textPrimary,
  },

  // Drawn when a pill's filter is active/open — the design's dark outline.
  active: {
    boxShadow: `inset 0 0 0 1px ${color.borderStrong}`,
  },
});
