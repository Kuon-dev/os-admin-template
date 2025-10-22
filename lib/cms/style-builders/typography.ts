import { CSSProperties } from 'react';
import { AlignmentType, TextTransform, TextDecoration } from '@/types/page-builder';

/**
 * Typography properties interface
 * Represents text styling properties
 */
export interface TypographyStyleProps {
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  alignment?: AlignmentType;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: TextTransform;
  textDecoration?: TextDecoration;
}

/**
 * Builds CSS typography styles from component props
 *
 * Single Responsibility: Only handles typography styling
 *
 * @param props - Typography properties
 * @returns CSS properties object with typography values
 *
 * @example
 * ```ts
 * const props = {
 *   fontSize: '18px',
 *   fontWeight: 'bold',
 *   color: '#333',
 *   alignment: 'center'
 * };
 * const styles = buildTypographyStyles(props);
 * // Returns: { fontSize: '18px', fontWeight: 'bold', ... }
 * ```
 */
export function buildTypographyStyles(props: TypographyStyleProps): CSSProperties {
  return {
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    fontFamily: props.fontFamily,
    color: props.color,
    textAlign: props.alignment,
    lineHeight: props.lineHeight,
    letterSpacing: props.letterSpacing,
    textTransform: props.textTransform || 'none',
    textDecoration: props.textDecoration || 'none',
  };
}
