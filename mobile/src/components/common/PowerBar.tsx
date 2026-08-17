import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { getPowerColor } from '../../utils/formatting';

interface PowerBarProps {
  level: number;
  showLabel?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PowerBar: React.FC<PowerBarProps> = ({
  level,
  showLabel = true,
  compact = false,
  style,
}) => {
  const clampedLevel = Math.max(1, Math.min(100, level || 0));
  const powerColor = getPowerColor(clampedLevel);

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>NIVEL DE PODER</Text>
          <Text style={[styles.value, { color: powerColor }]}>{clampedLevel} / 100</Text>
        </View>
      )}
      <View style={[styles.track, compact && styles.trackCompact]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedLevel}%`,
              backgroundColor: powerColor,
            },
          ]}
        />
        {/* HUD grid ticks */}
        <View style={styles.ticksOverlay}>
          <View style={[styles.tick, { left: '25%' }]} />
          <View style={[styles.tick, { left: '50%' }]} />
          <View style={[styles.tick, { left: '75%' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  value: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  track: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  trackCompact: {
    height: 5,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  ticksOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  tick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default PowerBar;
