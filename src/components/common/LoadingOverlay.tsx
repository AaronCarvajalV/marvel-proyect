import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface LoadingOverlayProps {
  message?: string;
  fullscreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'ESTABLECIENDO ENLACE TÁCTICO...',
  fullscreen = false,
  style,
}) => {
  return (
    <View style={[styles.container, fullscreen && styles.fullscreen, style]}>
      <View style={styles.arcReactorBox}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subtext}>S.H.I.E.L.D. SECURE PROTOCOL v4.8</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcReactorBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.borderCyan,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  message: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtext: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 1,
  },
});

export default LoadingOverlay;
