import { Platform, TextStyle } from 'react-native';
import { colors } from './colors';

const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const typography = {
  fontFamily: {
    mono: monoFont,
  },
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '900' as TextStyle['fontWeight'],
  },
  styles: {
    hudHeader: {
      fontSize: 22,
      fontWeight: '800' as TextStyle['fontWeight'],
      color: colors.text,
      letterSpacing: 2,
      textTransform: 'uppercase' as TextStyle['textTransform'],
    },
    hudSubheader: {
      fontSize: 12,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: colors.primary,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as TextStyle['textTransform'],
      fontFamily: monoFont,
    },
    hudMono: {
      fontFamily: monoFont,
      fontSize: 12,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700' as TextStyle['fontWeight'],
      color: colors.text,
      letterSpacing: 0.5,
    },
    cardSubtitle: {
      fontSize: 13,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: colors.textMuted,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: colors.textSecondary,
      lineHeight: 20,
    },
    caption: {
      fontSize: 11,
      fontWeight: '400' as TextStyle['fontWeight'],
      color: colors.textDim,
    },
    badge: {
      fontSize: 11,
      fontWeight: '700' as TextStyle['fontWeight'],
      letterSpacing: 1,
      textTransform: 'uppercase' as TextStyle['textTransform'],
      fontFamily: monoFont,
    },
  },
};
