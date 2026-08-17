import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Animated } from 'react-native';
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
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={[styles.container, style]}>
      {/* Scan Line effect at the bottom */}
      <View style={styles.scanLine} />
      
      <View style={styles.leftColumn}>
        <View style={styles.titleRow}>
          {showStatusIndicator && (
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
          )}
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
    borderBottomColor: colors.borderCyan,
    backgroundColor: colors.backgroundDark,
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  title: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
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
    borderRadius: 4, // More technical, less round
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default HeaderHUD;
