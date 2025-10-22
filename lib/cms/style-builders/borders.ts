import { CSSProperties } from 'react';

/**
 * Border properties interface
 * Represents border styling properties
 */
export interface BorderStyleProps {
  border?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
}

/**
 * Builds CSS border styles from component props
 *
 * Single Responsibility: Only handles border styling
 *
 * @param props - Border properties
 * @returns CSS properties object with border values
 *
 * @example
 * ```ts
 * const props = {
 *   border: '1px solid #ccc',
 *   borderRadius: '8px'
 * };
 * const styles = buildBorderStyles(props);
 * // Returns: { border: '1px solid #ccc', borderRadius: '8px' }
 * ```
 */
export function buildBorderStyles(props: BorderStyleProps): CSSProperties {
  return {
    border: props.border,
    borderRadius: props.borderRadius,
    borderColor: props.borderColor,
    borderWidth: props.borderWidth,
    borderStyle: props.borderStyle,
  };
}
