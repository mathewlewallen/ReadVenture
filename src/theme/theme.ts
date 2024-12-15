/**
 * Theme Configuration
 *
 * Defines the app's visual styling constants including colors, typography,
 * and other design tokens. Used throughout the app for consistent styling.
 *
 * @packageDocumentation
 */

export const theme = {
  colors: {
    // Main colors
    primary: '#6200EE', // Primary brand color
    secondary: '#03DAC6', // Secondary brand color
    background: '#FFFFFF', // Main background
    surface: '#FFFFFF', // Surface elements
    error: '#B00020', // Error states
    text: '#000000', // Primary text
    textSecondary: '#757575', // Secondary text
    border: '#E0E0E0', // Border color

    // Status colors
    success: '#4CAF50',
    warning: '#FB8C00',
    info: '#2196F3',

    // UI feedback
    ripple: 'rgba(0, 0, 0, 0.12)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },

  fonts: {
    regular: 'Quicksand-Regular',
    medium: 'Quicksand-Medium',
    bold: 'Quicksand-Bold',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  roundness: {
    small: 4,
    medium: 8,
    large: 16,
  },

  elevation: {
    none: 0,
    small: 2,
    medium: 4,
    large: 8,
  },

  animation: {
    scale: 1.0,
    duration: 200, // ms
  },
};

// Derive types from theme object
export type ThemeColors = typeof theme.colors;
export type ThemeFonts = typeof theme.fonts;

// Export theme type for TypeScript support
export type Theme = typeof theme;

// Default export
export default theme;
