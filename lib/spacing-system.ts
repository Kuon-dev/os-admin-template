/**
 * 4-Point Grid Spacing System
 *
 * This system ensures consistent spacing throughout the application
 * following macOS design principles and Apple's design system.
 *
 * All spacing is based on 4px units:
 * - 4px (1 unit) - Micro spacing between elements
 * - 8px (2 units) - Small gaps, icon padding
 * - 12px (3 units) - Tight grouping
 * - 16px (4 units) - Default/base spacing
 * - 20px (5 units) - Comfortable spacing
 * - 24px (6 units) - Section spacing
 * - 32px (8 units) - Large section separation
 * - 40px (10 units) - Page margins
 * - 48px (12 units) - Major sections
 */

export const spacing = {
  // Micro spacing - use sparingly
  xs: "4px",   // 1 unit - gap between very small elements
  sm: "8px",   // 2 units - small gaps, icon internal padding
  md: "12px",  // 3 units - tight grouping

  // Base spacing - most common
  base: "16px",  // 4 units - default spacing, button padding

  // Comfortable spacing
  lg: "20px",   // 5 units - comfortable separation
  xl: "24px",   // 6 units - section separation, card padding

  // Large spacing - major sections
  "2xl": "32px",  // 8 units - large section separation
  "3xl": "40px",  // 10 units - page margins, major gaps
  "4xl": "48px",  // 12 units - major sections
  "5xl": "64px",  // 16 units - very large spacing
};

/**
 * Component-specific spacing recommendations
 */
export const componentSpacing = {
  // Buttons
  button: {
    padding: "4px 16px",     // py-1 px-4
    minHeight: "36px",       // h-9
    gap: "8px",              // gap-2
  },
  buttonLarge: {
    padding: "8px 24px",     // py-2 px-6
    minHeight: "40px",       // h-10
    gap: "8px",              // gap-2
  },
  buttonSmall: {
    padding: "4px 12px",     // py-1 px-3
    minHeight: "32px",       // h-8
    gap: "6px",              // gap-1.5
  },
  buttonIcon: {
    size: "36px",            // size-9
  },

  // Input fields
  input: {
    padding: "4px 12px",     // py-1 px-3
    minHeight: "36px",       // h-9
    gap: "0",
  },

  // Cards
  card: {
    padding: "16px",         // p-4
    gap: "8px",              // gap-2
    borderRadius: "8px",     // rounded-lg
  },
  cardCompact: {
    padding: "12px",         // p-3
    gap: "6px",              // gap-1.5
    borderRadius: "8px",     // rounded-lg
  },

  // Modals / Dialogs
  modal: {
    padding: "24px",         // p-6
    gap: "16px",             // gap-4
    headerGap: "8px",        // gap-2 (title + description)
  },

  // Headers
  pageHeader: {
    paddingTop: "40px",      // pt-10
    paddingBottom: "24px",   // pb-6
    marginBottom: "24px",    // mb-6
  },

  // Sections
  section: {
    marginBottom: "32px",    // mb-8
    paddingBottom: "32px",   // pb-8
  },

  // Lists
  listItem: {
    padding: "8px 0",        // py-2
    gap: "4px",              // gap-1
  },
  listItemCompact: {
    padding: "4px 0",        // py-1
    gap: "2px",              // gap-0.5
  },

  // Tables
  tableRow: {
    padding: "16px",         // p-4
    minHeight: "48px",
  },
  tableCell: {
    padding: "12px 16px",    // px-4 py-3
  },

  // Badges
  badge: {
    padding: "2px 8px",      // px-2 py-0.5
    gap: "4px",              // gap-1
  },

  // Tooltips
  tooltip: {
    padding: "8px 12px",     // px-3 py-2
    gap: "4px",              // gap-1
  },
};

/**
 * Responsive spacing adjustments
 */
export const responsiveSpacing = {
  mobile: {
    pageMargin: "16px",      // p-4
    sectionGap: "16px",      // gap-4
    componentGap: "8px",     // gap-2
  },
  tablet: {
    pageMargin: "24px",      // p-6
    sectionGap: "24px",      // gap-6
    componentGap: "12px",    // gap-3
  },
  desktop: {
    pageMargin: "40px",      // p-10
    sectionGap: "32px",      // gap-8
    componentGap: "16px",    // gap-4
  },
};

/**
 * Helper function to apply spacing consistently
 */
export function getSpacing(size: keyof typeof spacing): string {
  return spacing[size];
}

/**
 * Common spacing patterns
 */
export const spacingPatterns = {
  // Vertical rhythm
  verticalRhythm: (multiplier: number = 1) => ({
    marginBottom: `${16 * multiplier}px`,
    paddingBottom: `${16 * multiplier}px`,
  }),

  // Horizontal grouping
  horizontalGroup: (gap: "xs" | "sm" | "md" | "lg" | "xl" = "md") => ({
    display: "flex",
    gap: spacing[gap],
    alignItems: "center",
  }),

  // Stack (vertical)
  stack: (gap: "xs" | "sm" | "md" | "lg" | "xl" = "md") => ({
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing[gap],
  }),

  // Grid spacing
  gridSpacing: (columns: number, gap: "xs" | "sm" | "md" | "lg" | "xl" = "md") => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: spacing[gap],
  }),

  // Container padding
  containerPadding: (size: "sm" | "md" | "lg" | "xl" = "md") => ({
    padding: spacing[size === "sm" ? "base" : size === "md" ? "xl" : size === "lg" ? "3xl" : "5xl"],
  }),
};

/**
 * Z-index scale for layering
 */
export const zIndex = {
  hidden: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  tooltip: 50,
  notification: 60,
};

/**
 * Animation timing scale
 */
export const animationDuration = {
  instant: "100ms",
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "400ms",
  slowest: "500ms",
};
