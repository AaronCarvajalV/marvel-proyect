import { colors } from './colors';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    full: 9999,
  },
};

export { colors, typography };
export default theme;
