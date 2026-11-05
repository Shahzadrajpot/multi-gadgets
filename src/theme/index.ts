/**
 * Multi Gadgets - Design System
 * Premium Tech & Gadgets Brand
 */

export const colors = {
  // Primary palette
  black: '#0D0D0D',
  deepBrown: '#3D2914',
  brown: '#5C4033',
  sandBeige: '#E8DCC4',
  sandLight: '#F5F0E6',
  white: '#FFFFFF',

  // Semantic
  accent: '#8B6914',
  accentHover: '#A67C1B',
  success: '#2D5A27',
  error: '#8B2E2E',
  warning: '#B8860B',

  // Neutrals
  gray900: '#1A1A1A',
  gray700: '#4A4A4A',
  gray500: '#737373',
  gray300: '#A3A3A3',
  gray100: '#E5E5E5',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
} as const;

export const typography = {
  fontFamily: {
    heading: "'Playfair Display', 'Georgia', serif",
    body: "'DM Sans', 'Inter', system-ui, sans-serif",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
    display: '48px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(13, 13, 13, 0.05)',
  md: '0 4px 12px rgba(13, 13, 13, 0.08)',
  lg: '0 8px 24px rgba(13, 13, 13, 0.12)',
  xl: '0 16px 48px rgba(13, 13, 13, 0.16)',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;
