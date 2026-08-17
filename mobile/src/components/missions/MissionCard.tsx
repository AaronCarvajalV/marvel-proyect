import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { StatusBadge } from '../common/StatusBadge';
import { formatMissionDate, formatMissionLocation } from '../../utils/formatting';

interface MissionCardProps {
  mission: Mission;
  onPressHero?: (heroId: number) => void;
  onPressEdit?: (missionId: number) => void;
  onPressDelete?: (missionId: number, missionTitle: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onPressHero,
  onPressEdit,
  onPressDelete,
  style,
}) => {
  const [heroImageError, setHeroImageError] = useState(false);
  const assignedHero = mission.hero || mission.superheroe;
  const locationText = formatMissionLocation(mission.target_location, mission.ubicacion);
  const formattedDate = formatMissionDate(mission.fecha);

  return (
    <View style={[styles.container, style]}>
      {/* Corner HUD markers */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      {/* Header with Title and Threat Level */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {mission.titulo}
          </Text>
        </View>
        <StatusBadge type="threat" value={mission.nivel_peligro} size="sm" />
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {mission.descripcion}
      </Text>

      {/* Tactical Telemetry: Location and Date */}
      <View style={styles.telemetryGrid}>
        <View style={styles.telemetryItem}>
          <Ionicons name="location-outline" size={14} color={colors.primary} style={styles.metaIcon} />
          <Text style={styles.metaText} numberOfLines={1}>
            {locationText}
          </Text>
        </View>
        <View style={styles.telemetryItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} style={styles.metaIcon} />
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>
      </View>

      {/* Footer: Status Badge and Assigned Hero Operative */}
      <View style={styles.footerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <StatusBadge type="mission_status" value={mission.estado} size="sm" />
          
          {onPressEdit && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onPressEdit(mission.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}

          {onPressDelete && (
            <TouchableOpacity
              style={[styles.editButton, { borderColor: colors.danger }]}
              onPress={() => onPressDelete(mission.id, mission.titulo)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        {assignedHero && (
          <TouchableOpacity
            style={styles.heroBadge}
            onPress={() => onPressHero && onPressHero(assignedHero.id)}
            disabled={!onPressHero}
            activeOpacity={0.7}
          >
            <View style={styles.heroAvatarContainer}>
              {assignedHero.imagen_url && !heroImageError ? (
                <Image
                  source={{ uri: assignedHero.imagen_url }}
                  style={styles.heroAvatar}
                  onError={() => setHeroImageError(true)}
                />
              ) : (
                <Ionicons name="person" size={12} color={colors.primary} />
              )}
            </View>
            <Text style={styles.heroName} numberOfLines={1}>
              {assignedHero.nombre}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderColor: colors.borderCyan,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  telemetryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    maxWidth: '55%',
  },
  heroAvatarContainer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: colors.surfaceVariant,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
  },
  heroName: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    backgroundColor: colors.primaryGlow,
  },
  editButtonText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
});

export default MissionCard;
