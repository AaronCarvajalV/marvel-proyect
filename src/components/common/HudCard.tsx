import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';

interface HudCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'glow' | 'gold' | 'danger';
  noPadding?: boolean;
}

export const HudCard: React.FC<HudCardProps> = ({
  children,
  style,
  variant = 'default',
  noPadding = false,
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'glow':
        return colors.borderCyan;
      case 'gold':
        return colors.borderGold;
      case 'danger':
        return colors.borderDanger;
      default:
        return colors.border;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: getBorderColor() },
        noPadding && { padding: 0 },
        variant === 'glow' && styles.glow,
        style,
      ]}
    >
      {/* HUD Corner Accents */}
      <View style={[styles.corner, styles.topLeft, { borderColor: getBorderColor() }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: getBorderColor() }]} />
      <View style={[styles.corner, styles.bottomLeft, { borderColor: getBorderColor() }]} />
      <View style={[styles.corner, styles.bottomRight, { borderColor: getBorderColor() }]} />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  corner: {
    position: 'absolute',
    width: 8,
    height: 8,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});

export default HudCard;
