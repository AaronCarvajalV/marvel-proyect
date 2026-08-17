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
import { Hero } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { StatusBadge } from '../common/StatusBadge';
import { PowerBar } from '../common/PowerBar';

interface HeroCardProps {
  hero: Hero;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.container, style]}
    >
      {/* HUD Corner accents */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      <View style={styles.cardContent}>
        {/* Hero Avatar / Image */}
        <View style={styles.imageWrapper}>
          {hero.imagen_url && !imageError ? (
            <Image
              source={{ uri: hero.imagen_url }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="shield" size={28} color={colors.primary} />
            </View>
          )}
          <View style={styles.imageFrame} />
        </View>

        {/* Info Column */}
        <View style={styles.infoColumn}>
          <View style={styles.headerRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {hero.nombre}
              </Text>
              <Text style={styles.realName} numberOfLines={1}>
                {hero.nombre_real}
              </Text>
            </View>

            {onToggleFavorite && (
              <TouchableOpacity
                onPress={onToggleFavorite}
                style={styles.favoriteButton}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={20}
                  color={isFavorite ? colors.secondary : colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Primary Power */}
          <Text style={styles.powerText} numberOfLines={2}>
            {hero.poder_principal}
          </Text>

          {/* Power Level Gauge */}
          <PowerBar level={hero.nivel_poder} compact style={styles.powerBar} />

          {/* Status Badge & Missions count */}
          <View style={styles.footerRow}>
            <StatusBadge type="hero_status" value={hero.estado} size="sm" />
            {typeof hero.missions_count === 'number' && (
              <Text style={styles.missionsCount}>
                {hero.missions_count} {hero.missions_count === 1 ? 'MISIÓN' : 'MISIONES'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
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
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageWrapper: {
    width: 80,
    height: 96,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  imageFrame: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    borderRadius: 6,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  realName: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  powerText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 15,
  },
  powerBar: {
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  missionsCount: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
  },
});

export default HeroCard;
