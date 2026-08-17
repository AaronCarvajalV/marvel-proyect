import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface HeaderHUDProps {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showStatusIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  title,
  subtitle,
  rightIcon,
  onRightIconPress,
  showStatusIndicator = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftColumn}>
        <View style={styles.titleRow}>
          {showStatusIndicator && <View style={styles.pulseDot} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name={rightIcon} size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  leftColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  title: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default HeaderHUD;
