import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudButton } from './HudButton';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  title = 'ERROR DE TELEMETRÍA',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <Ionicons name="warning-outline" size={20} color={colors.dangerHigh} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <HudButton
          title="REINTENTAR ENLACE"
          onPress={onRetry}
          variant="danger"
          size="sm"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderWidth: 1,
    borderColor: colors.borderDanger,
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.dangerHigh,
    letterSpacing: 1,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-start',
  },
});

export default ErrorMessage;
