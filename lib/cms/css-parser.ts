import { CSSProperties } from 'react';

/**
 * Safely parses custom CSS string into CSSProperties object
 *
 * SECURITY: Replaces dangerous eval() with safe parsing methods
 * This prevents XSS vulnerabilities from malicious CSS injection
 *
 * Supports two formats:
 * 1. JSON format: {"backgroundColor": "red", "fontSize": "20px"}
 * 2. CSS string format: "background-color: red; font-size: 20px;"
 *
 * @param customCss - Custom CSS string to parse
 * @returns Parsed CSS properties object
 *
 * @example
 * ```ts
 * // JSON format
 * const styles1 = parseCustomCss('{"backgroundColor": "red"}');
 * // Returns: { backgroundColor: "red" }
 *
 * // CSS string format
 * const styles2 = parseCustomCss('background-color: red; font-size: 20px;');
 * // Returns: { backgroundColor: "red", fontSize: "20px" }
 *
 * // Invalid CSS
 * const styles3 = parseCustomCss('invalid css');
 * // Returns: {} (empty object, no error thrown)
 * ```
 */
export function parseCustomCss(customCss?: string): CSSProperties {
  if (!customCss || customCss.trim() === '') {
    return {};
  }

  try {
    // Method 1: JSON.parse for object notation (safer than eval)
    if (customCss.trim().startsWith('{')) {
      return JSON.parse(customCss) as CSSProperties;
    }

    // Method 2: Parse CSS string syntax
    return parseCssString(customCss);
  } catch (error) {
    console.error('Failed to parse custom CSS:', error);
    return {};
  }
}

/**
 * Parses CSS string syntax into CSSProperties
 *
 * Converts CSS declarations like "background-color: red; font-size: 20px;"
 * into React CSSProperties: { backgroundColor: 'red', fontSize: '20px' }
 *
 * @param cssString - CSS string with declarations
 * @returns Parsed CSS properties object
 */
function parseCssString(cssString: string): CSSProperties {
  const styles: CSSProperties = {};

  // Split by semicolon and process each declaration
  const declarations = cssString.split(';').filter(d => d.trim());

  for (const declaration of declarations) {
    const colonIndex = declaration.indexOf(':');

    if (colonIndex === -1) continue;

    const property = declaration.slice(0, colonIndex).trim();
    const value = declaration.slice(colonIndex + 1).trim();

    if (!property || !value) continue;

    // Convert kebab-case to camelCase (background-color → backgroundColor)
    const camelProperty = kebabToCamel(property);

    // Validate property is a valid CSS property
    if (isValidCssProperty(camelProperty)) {
      styles[camelProperty as keyof CSSProperties] = value as any;
    } else {
      console.warn(`Invalid CSS property: ${property} (${camelProperty})`);
    }
  }

  return styles;
}

/**
 * Converts kebab-case to camelCase
 *
 * @param str - Kebab-case string
 * @returns CamelCase string
 *
 * @example
 * kebabToCamel('background-color') // 'backgroundColor'
 * kebabToCamel('font-size') // 'fontSize'
 */
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Validates if a property is a safe CSS property
 *
 * Uses a whitelist approach to prevent injection of dangerous properties
 * or non-CSS properties
 *
 * @param property - Property name to validate (camelCase)
 * @returns True if property is in the whitelist
 */
function isValidCssProperty(property: string): boolean {
  // Whitelist of allowed CSS properties
  const allowedProperties = new Set([
    // Colors
    'color',
    'backgroundColor',
    'borderColor',
    'outlineColor',

    // Typography
    'fontSize',
    'fontWeight',
    'fontFamily',
    'fontStyle',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'textDecoration',
    'textTransform',
    'wordSpacing',
    'whiteSpace',

    // Spacing
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'padding',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',

    // Border
    'border',
    'borderTop',
    'borderBottom',
    'borderLeft',
    'borderRight',
    'borderWidth',
    'borderStyle',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',

    // Dimensions
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',

    // Display & Layout
    'display',
    'position',
    'top',
    'bottom',
    'left',
    'right',
    'float',
    'clear',
    'overflow',
    'overflowX',
    'overflowY',
    'visibility',
    'zIndex',

    // Flexbox
    'flex',
    'flexDirection',
    'flexWrap',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'alignContent',
    'gap',
    'rowGap',
    'columnGap',

    // Grid
    'grid',
    'gridTemplate',
    'gridTemplateColumns',
    'gridTemplateRows',
    'gridColumn',
    'gridRow',
    'gridArea',
    'gridAutoFlow',
    'gridAutoColumns',
    'gridAutoRows',

    // Effects
    'opacity',
    'boxShadow',
    'textShadow',
    'filter',
    'backdropFilter',

    // Transform & Animation
    'transform',
    'transformOrigin',
    'transition',
    'animation',

    // Background
    'background',
    'backgroundImage',
    'backgroundPosition',
    'backgroundSize',
    'backgroundRepeat',
    'backgroundAttachment',
    'backgroundClip',

    // Cursor & Pointer
    'cursor',
    'pointerEvents',

    // Object fit for images
    'objectFit',
    'objectPosition',

    // Outline
    'outline',
    'outlineWidth',
    'outlineStyle',
    'outlineOffset',
  ]);

  return allowedProperties.has(property);
}
