import { Platform } from 'react-native';

export const colors = {
  background: '#F4F5FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F8F9FD',
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primarySoft: '#EEF0FF',
  primaryMuted: '#C7CBFA',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255,255,255,0.72)',
  text: '#111427',
  textSecondary: '#5E6378',
  textTertiary: '#9A9EB2',
  border: '#E6E8F2',
  track: '#ECEEF6',
  success: '#12A26B',
  successSoft: '#E4F7EF',
  danger: '#D93A3A',
  dangerSoft: '#FDECEC',
  warningBackground: '#FFF6E6',
  warningBorder: '#FFE2B0',
  warningText: '#8A4B00',
  warning: '#F59E0B',
  skeleton: '#E7E9F3',
};

export const accents = [
  { tint: '#4F46E5', soft: '#EEF0FF' },
  { tint: '#0EA5A4', soft: '#E3F7F6' },
  { tint: '#E8590C', soft: '#FFF0E6' },
  { tint: '#C026D3', soft: '#FBEAFD' },
  { tint: '#2563EB', soft: '#E8F0FE' },
  { tint: '#16A34A', soft: '#E7F7EC' },
];

export function accentFor(key) {
  const text = String(key ?? '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 2147483647;
  }
  return accents[hash % accents.length];
}

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 17, fontWeight: '500' },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
};

const shadow = (height, blur, opacity, elevation) =>
  Platform.select({
    ios: {
      shadowColor: '#1B1F4B',
      shadowOffset: { width: 0, height },
      shadowRadius: blur,
      shadowOpacity: opacity,
    },
    default: { elevation },
  });

export const shadows = {
  sm: shadow(2, 6, 0.06, 2),
  md: shadow(8, 20, 0.08, 4),
  lg: shadow(16, 32, 0.14, 8),
  primary: Platform.select({
    ios: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      shadowOpacity: 0.3,
    },
    default: { elevation: 6 },
  }),
};

export const motion = {
  fast: 160,
  base: 260,
  slow: 420,
  stagger: 60,
  spring: { damping: 18, stiffness: 260, mass: 0.9 },
};
