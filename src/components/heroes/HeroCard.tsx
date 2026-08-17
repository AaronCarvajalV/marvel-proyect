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
  const isCovert = hero.estado === 'INACTIVO';

  // Determine Icon based on name logic from Web
  let iconName: keyof typeof Ionicons.glyphMap = 'shield-outline';
  const name = hero.nombre.toUpperCase();
  if (name.includes('IRON')) iconName = 'hardware-chip-outline';
  else if (name.includes('SPIDER')) iconName = 'bug-outline';
  else if (name.includes('CAPTAIN') || name.includes('AMERICA')) iconName = 'shield-outline';
  else if (name.includes('THOR')) iconName = 'flash-outline';
  else if (name.includes('HULK')) iconName = 'fitness-outline';
  else if (name.includes('WIDOW')) iconName = 'medical-outline';
  else if (name.includes('PANTHER')) iconName = 'paw-outline';
  else if (name.includes('STRANGE')) iconName = 'eye-outline';
  else if (name.includes('ANT')) iconName = 'scan-outline';
  else if (name.includes('MARVEL')) iconName = 'star-outline';
  else if (name.includes('DEADPOOL')) iconName = 'happy-outline';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={[styles.imageContainer, isCovert && { borderBottomColor: colors.borderCyan }]}>
        <Image
          source={{
            uri: hero.imagen_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAfQWN9tiQ0bvTT7IEP1tALNwpsB1gCusw-5Y7VERnlRtr2kcFGt6uBTDta_BPsV0pY84POUiP6zzL_K99KkFdzw_woJODSHE7zbPz9iHOZKD3tRGT6_G2o0D4Q-kTFJfIPCbqRo0ZTMydh7eWgn0k0nnxHTpAjNb4x5wgQ75Rz6qKpPaMTRUc5perDfVWExOxANYtUDnPgVj5yQCHx2KBMAF-pNUxYHH9V_zwbF_EiwYqJfMoRedl'
          }}
          style={styles.image}
        />

        {/* Status Badge */}
        <View style={[styles.statusBadge, isCovert && styles.statusBadgeCovert]}>
          <View style={[styles.statusDot, !isCovert && styles.statusDotActive]} />
          <Text style={[styles.statusText, isCovert && styles.statusTextCovert]}>{hero.estado}</Text>
        </View>

        {/* ID Badge */}
        <View style={styles.idBadge}>
          <Text style={styles.idText}>ID: STK-{hero.id.toString().padStart(3, '0')}</Text>
        </View>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <TouchableOpacity 
            onPress={onToggleFavorite} 
            style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]}
          >
            <Ionicons name={isFavorite ? 'star' : 'star'} size={18} color={isFavorite ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, isCovert && { color: colors.textSecondary }]}>{hero.nombre}</Text>
            <Text style={styles.realName}>{hero.nombre_real || 'CLASSIFIED'}</Text>
          </View>
          <Ionicons name={iconName} size={28} color={isCovert ? colors.textMuted : colors.primary} style={{ opacity: 0.7 }} />
        </View>

        <View style={styles.powerGrid}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>MAIN POWER</Text>
            <Text style={styles.value} numberOfLines={1}>{hero.poder_principal}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>POWER LEVEL</Text>
            <Text style={[styles.value, { color: colors.textSecondary }]}>LVL_{hero.nivel_poder}</Text>
          </View>
        </View>

        <View style={styles.readinessSection}>
          <View style={styles.readinessRow}>
            <Text style={styles.label}>COMBAT_READINESS</Text>
            <Text style={[styles.label, { color: isCovert ? colors.textMuted : colors.primary }]}>{hero.nivel_poder}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill, 
              { 
                width: `${Math.min(100, hero.nivel_poder)}%`, 
                backgroundColor: isCovert ? colors.textMuted : colors.primary 
              }
            ]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 256,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCyan,
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderColor: 'rgba(0, 229, 255, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBadgeCovert: {
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
    marginRight: 4,
  },
  statusDotActive: {
    backgroundColor: colors.primary,
  },
  statusText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primary,
  },
  statusTextCovert: {
    color: colors.textSecondary,
  },
  idBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  idText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderColor: 'rgba(0, 229, 255, 0.2)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 20,
  },
  favoriteBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderColor: colors.primary,
  },
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 24,
    color: colors.text,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  realName: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  powerGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 4,
  },
  value: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  readinessSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.3)',
    paddingTop: 16,
  },
  readinessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.borderCyan,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
});

export default HeroCard;
