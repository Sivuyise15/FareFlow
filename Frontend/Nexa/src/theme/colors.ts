export const colors = {
  // surfaces
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F7F9',
  surfaceInset: '#FFFFFF',
  surfaceButton: '#F1F2F4',

  // text
  textPrimary: '#0B0B0F',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // brand
  accent: '#1D6DF0',
  accentSoft: '#EAF1FE',
  accentTrack: '#BFD5F8',

  // status
  danger: '#DC2626',
  dangerText: '#B4474D',
  dangerSoft: '#FDECEC',
  dangerBorder: '#F7C9C9',

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
