export const colors = {
  // surfaces
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F7F9',
  surfaceInset: '#FFFFFF',

  // text
  textPrimary: '#0B0B0F',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // brand
  accent: '#1D6DF0',
  accentSoft: '#EAF1FE',

  // borders
  border: '#ECEDF0',
  borderSoft: '#F1F2F4',
  borderAccent: '#D6E4FD',

  // provider marks
  gmail: '#EA4335',
  outlook: '#0F6CBD',

  black: '#0B0B0F',
  white: '#FFFFFF',
} as const;

export type Colors = typeof colors;
