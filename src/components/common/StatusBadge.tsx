import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MissionThreatLevel, MissionStatus, HeroStatus, UserRole } from '../../types';
import { getThreatColor, getStatusColor, getClearanceColor } from '../../utils/formatting';
import { typography } from '../../theme/typography';

interface StatusBadgeProps {
  type: 'threat' | 'mission_status' | 'hero_status' | 'clearance' | 'custom';
  value: string;
  customColor?: { bg: string; text: string; border: string };
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  value,
  customColor,
  size = 'md',
  style,
}) => {
  let color = { bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' };

  if (customColor) {
    color = customColor;
  } else if (type === 'threat') {
    color = getThreatColor(value as MissionThreatLevel);
  } else if (type === 'mission_status') {
    color = getStatusColor(value as MissionStatus);
  } else if (type === 'hero_status') {
    color = getStatusColor(value as HeroStatus);
  } else if (type === 'clearance') {
    color = getClearanceColor(value as UserRole);
  }

  const getLabel = () => {
    if (type === 'clearance') {
      return `CLEARANCE: ${value}`;
    }
    if (type === 'threat') {
      return `PELIGRO ${value}`;
    }
    return value.replace('_', ' ');
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color.bg,
          borderColor: color.border,
        },
        size === 'sm' && styles.badgeSm,
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color.text }]} />
      <Text style={[styles.text, { color: color.text }, size === 'sm' && styles.textSm]}>
        {getLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  textSm: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
