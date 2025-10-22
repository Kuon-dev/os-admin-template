import { CSSProperties } from 'react';

/**
 * Spacing properties interface
 * Represents margin and padding properties for components
 */
export interface SpacingProps {
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

/**
 * Builds CSS spacing styles from component props
 *
 * Single Responsibility: Only handles spacing (margin/padding)
 *
 * @param props - Spacing properties
 * @returns CSS properties object with spacing values
 *
 * @example
 * ```ts
 * const props = { marginTop: '20px', paddingLeft: '1rem' };
 * const styles = buildSpacingStyles(props);
 * // Returns: { marginTop: '20px', paddingLeft: '1rem', ... }
 * ```
 */
export function buildSpacingStyles(props: SpacingProps): CSSProperties {
  return {
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
  };
}
