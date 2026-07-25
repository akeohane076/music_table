import * as stylex from '@stylexjs/stylex';
import {color, font, radius, size, text} from '../../theme/tokens.stylex.ts';

export const input = stylex.create({
  field: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: size.controlHeight,
    width: '100%',
    backgroundColor: color.surface,
    borderRadius: radius.control,
    // The stroke is an inset box-shadow, matching Figma's inside strokes: it takes no
    // layout space, so the icon's 12px and the text's 40px insets measure from the true
    // edge, and gaining the focused stroke never shifts layout.
    boxShadow: {
      default: 'none',
      ':hover': `inset 0 0 0 1px ${color.iconMuted}`,
      ':focus-within': `inset 0 0 0 1px ${color.borderStrong}`,
    },
  },
  // For use inside a container that already supplies the chrome (e.g. a popover header row).
  plain: {
    backgroundColor: 'transparent',
    boxShadow: {default: 'none', ':hover': 'none', ':focus-within': 'none'},
    borderRadius: 0,
    height: '100%',
  },
  control: {
    width: '100%',
    height: '100%',
    paddingInline: '12px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius.control,
    fontFamily: font.family,
    fontSize: text.inputSize,
    lineHeight: text.inputLine,
    fontWeight: text.inputWeight,
    color: color.textPrimary,
    '::placeholder': {color: color.textMuted, opacity: 1},
    // Chrome renders its own clear affordance on type=search; the endIcon replaces it.
    '::-webkit-search-cancel-button': {display: 'none'},
  },
  // Clear the 20px start glyph sitting at 12px.
  padStart: {paddingInlineStart: '40px'},
  // Clear the end adornment.
  padEnd: {paddingInlineEnd: '40px'},

  startAdornment: {
    position: 'absolute',
    insetInlineStart: '12px',
    display: 'flex',
    alignItems: 'center',
    color: color.iconStrong,
    // Decorative by default — clicks fall through to the field.
    pointerEvents: 'none',
  },
  endAdornment: {
    position: 'absolute',
    insetInlineEnd: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});
