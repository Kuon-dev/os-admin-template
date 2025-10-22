import { CSSProperties } from 'react';

// Re-export all style builders
export { buildSpacingStyles, type SpacingProps } from './spacing';
export { buildTypographyStyles, type TypographyStyleProps } from './typography';
export { buildEffectsStyles, type EffectsStyleProps } from './effects';
export { buildBorderStyles, type BorderStyleProps } from './borders';

// Import for composite functions
import { buildSpacingStyles, SpacingProps } from './spacing';
import { buildEffectsStyles, EffectsStyleProps } from './effects';

/**
 * Common style properties interface
 * Combines spacing and effects - the most commonly used properties
 */
export type CommonStyleProps = SpacingProps & EffectsStyleProps;

/**
 * Builds common styles used by most components
 *
 * Open/Closed Principle: Open for extension (add new builders), Closed for modification
 *
 * @param props - Common style properties (spacing + effects)
 * @returns CSS properties object with common styles
 *
 * @example
 * ```ts
 * const props = {
 *   marginTop: '20px',
 *   paddingLeft: '1rem',
 *   opacity: 0.9
 * };
 * const styles = buildCommonStyles(props);
 * // Returns combined spacing + effects styles
 * ```
 */
export function buildCommonStyles(props: CommonStyleProps): CSSProperties {
  return {
    ...buildSpacingStyles(props),
    ...buildEffectsStyles(props),
  };
}

/**
 * Merges multiple style objects with proper priority
 *
 * Priority order (highest to lowest):
 * 1. Custom styles (highest priority)
 * 2. Component-specific styles
 * 3. Common styles (lowest priority)
 *
 * @param styles - Array of style objects to merge
 * @returns Merged CSS properties object
 *
 * @example
 * ```ts
 * const merged = mergeStyles([
 *   buildCommonStyles(props),
 *   buildTypographyStyles(props),
 *   customStyles
 * ]);
 * ```
 */
export function mergeStyles(...styles: (CSSProperties | undefined)[]): CSSProperties {
  return styles.reduce<CSSProperties>((acc, style) => {
    if (!style) return acc;
    return { ...acc, ...style };
  }, {});
}
