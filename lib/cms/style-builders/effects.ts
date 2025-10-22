import { CSSProperties } from 'react';

/**
 * Effects properties interface
 * Represents visual effect properties like shadows and opacity
 */
export interface EffectsStyleProps {
  opacity?: number;
  textShadow?: string;
  boxShadow?: string;
}

/**
 * Builds CSS effect styles from component props
 *
 * Single Responsibility: Only handles visual effects (shadows, opacity)
 *
 * @param props - Effects properties
 * @returns CSS properties object with effect values
 *
 * @example
 * ```ts
 * const props = {
 *   opacity: 0.8,
 *   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
 * };
 * const styles = buildEffectsStyles(props);
 * // Returns: { opacity: 0.8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
 * ```
 */
export function buildEffectsStyles(props: EffectsStyleProps): CSSProperties {
  return {
    opacity: props.opacity ?? 1,
    textShadow: props.textShadow,
    boxShadow: props.boxShadow,
  };
}
