/**
 * Design Tokens & Style Guide
 * 4-based scale for consistent spacing, sizing, and typography
 * All values are multiples of 4px for perfect alignment and rhythm
 */

// ============================================================================
// SPACING SCALE (4px base)
// ============================================================================
export const spacing = {
  xs: "4px", // 1 unit
  sm: "8px", // 2 units
  md: "12px", // 3 units
  lg: "16px", // 4 units
  xl: "20px", // 5 units
  "2xl": "24px", // 6 units
  "3xl": "32px", // 8 units
  "4xl": "40px", // 10 units
  "5xl": "48px", // 12 units
};

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================
export const typography = {
  // Font families
  family: {
    mono: '"JetBrains Mono", monospace',
  },

  // Font sizes (in px) - all multiples of 4 or standard values
  size: {
    xs: "10px", // Extra small, labels
    sm: "12px", // Small, secondary text
    base: "14px", // Base size for body text
    md: "16px", // Medium
    lg: "18px", // Large, section headers
    xl: "20px", // Extra large, main headers
    "2xl": "24px", // 2x large, page titles
  },

  // Font weights
  weight: {
    normal: "400",
    medium: "500",
    semibold: "600",
  },

  // Line heights (unitless, multipliers)
  leading: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// ============================================================================
// LAYOUT DIMENSIONS (4-based scale)
// ============================================================================
export const dimensions = {
  // Border radius values
  radius: {
    none: "0",
    sm: "4px",
    md: "6px",
    lg: "8px",
    full: "9999px",
  },

  // Border widths
  border: {
    thin: "1px",
    default: "1px",
    thick: "2px",
  },

  // Icon sizes
  icon: {
    xs: "16px", // 4 units
    sm: "20px", // 5 units
    md: "24px", // 6 units
    lg: "32px", // 8 units
    xl: "40px", // 10 units
  },

  // Component heights
  height: {
    xs: "24px", // Extra small input/button
    sm: "28px", // Small button
    md: "32px", // Standard button/input
    lg: "40px", // Large button
    xl: "48px", // Extra large button
  },

  // Component widths (common patterns)
  width: {
    input: "80px", // 20 units (e.g., address input)
    button: "100px", // 25 units (standard button)
    panel: "240px", // 60 units (sidebar/panel)
    divider: "5px", // Separator width (1.25 units)
  },
};

// ============================================================================
// COLOR PALETTE
// ============================================================================
export const colors = {
  // Background colors
  bg: {
    primary: "#1a1a1a", // Main background
    secondary: "#222222", // Card backgrounds
    tertiary: "#2a2a2a", // Hover states
    quaternary: "#313131", // Disabled states
  },

  // Border colors
  border: {
    primary: "#111111", // Dark border
    secondary: "#3a3a3a", // Light border (divider)
  },

  // Text colors
  text: {
    primary: "#a9b1d6", // Main text
    secondary: "#787c99", // Secondary text
    tertiary: "#4a4a5a", // Muted text
  },

  // Semantic colors
  semantic: {
    green: "#73daca", // Success
    red: "#f7768e", // Error/Danger
    amber: "#e0af68", // Warning
    purple: "#bb9af7", // Info/Active
    blue: "#7aa2f7", // Primary/Link
    orange: "#ff9e64", // Accent
    cyan: "#7dcfff", // Highlight
  },
};

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================
export const components = {
  button: {
    padding: {
      xs: `${spacing.xs} ${spacing.md}`, // 4px 12px
      sm: `${spacing.sm} ${spacing.lg}`, // 8px 16px
      md: `${spacing.md} ${spacing.xl}`, // 12px 20px
      lg: `${spacing.lg} ${spacing["2xl"]}`, // 16px 24px
    },
    fontSize: typography.size.sm, // 12px
    height: {
      xs: dimensions.height.xs,
      sm: dimensions.height.sm,
      md: dimensions.height.md,
      lg: dimensions.height.lg,
    },
    radius: dimensions.radius.md,
    borderWidth: dimensions.border.default,
  },

  input: {
    padding: `${spacing.md} ${spacing.lg}`, // 12px 16px
    fontSize: typography.size.sm, // 12px
    height: dimensions.height.md, // 32px
    radius: dimensions.radius.md,
    borderWidth: dimensions.border.default,
  },

  card: {
    padding: spacing["2xl"], // 24px
    radius: dimensions.radius.lg,
    borderWidth: dimensions.border.default,
  },

  panel: {
    padding: spacing["2xl"], // 24px
    gap: spacing.lg, // 16px
    radius: dimensions.radius.lg,
    borderWidth: dimensions.border.default,
  },

  table: {
    padding: spacing.lg, // 16px
    gap: spacing.md, // 12px
    fontSize: typography.size.sm, // 12px
  },

  badge: {
    padding: `${spacing.xs} ${spacing.sm}`, // 4px 8px
    fontSize: typography.size.xs, // 10px
    radius: dimensions.radius.sm,
  },

  divider: {
    width: dimensions.width.divider, // 5px
    height: "28px",
  },

  topbar: {
    height: "48px", // 12 units
    padding: spacing.lg, // 16px
    gap: spacing.lg,
  },

  footer: {
    height: "48px", // 12 units
    padding: spacing.sm, // 8px
    gap: spacing.xs, // 4px
  },
};

// ============================================================================
// RESPONSIVE BREAKPOINTS (4-based scale consideration)
// ============================================================================
export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "1024px",
  lg: "1280px",
  xl: "1536px",
};

// ============================================================================
// SHADOW & EFFECTS
// ============================================================================
export const effects = {
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 8px rgba(0, 0, 0, 0.3)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.4)",
  },

  transition: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate spacing utility (4-based scale)
 * @param {number} units - Number of 4px units
 * @returns {string} CSS value
 */
export const getSpacing = (units) => `${units * 4}px`;

/**
 * Generate font size (ensure readable)
 * @param {number} size - Font size in pixels
 * @returns {string} CSS value
 */
export const getFontSize = (size) => `${size}px`;

/**
 * Combine multiple spacing values
 * @param {...string} values - Spacing values
 * @returns {string} Combined CSS value
 */
export const combineSpacing = (...values) => values.join(" ");
