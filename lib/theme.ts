export const colors = {
  bg: '#05060f',
  bgElevated: '#0c0e22',
  panel: 'rgba(255,255,255,0.04)',
  panelBorder: 'rgba(255,255,255,0.08)',
  text: '#f4f1ff',
  textMuted: 'rgba(244,241,255,0.62)',
  textFaint: 'rgba(244,241,255,0.35)',
  gold: '#f5d061',
  goldSoft: '#d4a94a',
  cosmic: '#7c5cff',
  cosmicDeep: '#4d2ed1',
  nebulaPink: '#ff7ad9',
  starlight: '#9dd9ff',
  success: '#5bd9a0',
  danger: '#ff6b6b',
};

export const gradients = {
  cosmic: ['#0b0524', '#1a0a40', '#3b0d6b'] as const,
  card: ['#0a0a1f', '#171036', '#22094a'] as const,
  galaxy: ['#000010', '#15043a', '#3a0a6b', '#7c2ed1'] as const,
  aurora: ['#021131', '#1e1a6e', '#9d3cb1'] as const,
};

export const fonts = {
  display: 'CormorantGaramond',
  body: 'Inter',
};

export const spacing = (n: number) => n * 4;

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
};
