import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Hero } from '../../types';
import { heroesApi } from '../../api';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudCard } from '../../components/common/HudCard';
import { HudButton } from '../../components/common/HudButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PowerBar } from '../../components/common/PowerBar';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { HeroDetailRouteProp } from '../../navigation/types';
import { getPowerColor } from '../../utils/formatting';

export const HeroDetailScreen: React.FC = () => {
  const route = useRoute<HeroDetailRouteProp>();
  const navigation = useNavigation<any>(); // Cast to any to bypass TS error with nested navigators
  const { heroId } = route.params;

  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteActive = isFavorite(heroId);

  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchHeroDetail = useCallback(async () => {
    setError(null);
    try {
      const data = await heroesApi.getHeroById(heroId);
      setHero(data);
    } catch (err: unknown) {
      let msg = 'Failed to load operative dossier.';
      if (err && typeof err === 'object' && 'message' in err) {
        msg = String((err as { message: string }).message);
      }
      setError(msg);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [heroId]);

  useEffect(() => {
    fetchHeroDetail();
  }, [fetchHeroDetail]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHeroDetail();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top HUD Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            DOSSIER #{heroId}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleFavorite(heroId)}
          style={[styles.favIconButton, favoriteActive && styles.favIconButtonActive]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={favoriteActive ? 'star' : 'star-outline'}
            size={20}
            color={favoriteActive ? colors.primary : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <LoadingOverlay message="DECRYPTING DOSSIER..." fullscreen />
      ) : error || !hero ? (
        <View style={styles.centerContainer}>
          <ErrorMessage
            title="ACCESS DENIED"
            message={error || 'Operative not found in database.'}
            onRetry={fetchHeroDetail}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Main Hero Header Card */}
          <HudCard variant="glow" style={styles.headerCard}>
            <View style={styles.portraitSection}>
              <View style={styles.portraitFrame}>
                {hero.imagen_url && !imageError ? (
                  <Image
                    source={{ uri: hero.imagen_url }}
                    style={styles.portraitImage}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <View style={styles.portraitPlaceholder}>
                    <Ionicons name="shield" size={64} color={colors.primary} />
                  </View>
                )}
                {/* HUD Scanning Line Graphic */}
                <View style={styles.scanLine} />
              </View>

              <View style={styles.heroIdentity}>
                <Text style={styles.heroCodename}>{hero.nombre.toUpperCase()}</Text>
                <Text style={styles.heroRealName}>
                  REAL IDENTITY: <Text style={styles.realNameHighlight}>{hero.nombre_real.toUpperCase()}</Text>
                </Text>

                <View style={styles.statusRow}>
                  <StatusBadge type="hero_status" value={hero.estado} />
                  <View style={styles.idBadge}>
                    <Text style={styles.idBadgeText}>ID: S.H.I.E.L.D.-{hero.id.toString().padStart(4, '0')}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Favorite Action Button */}
            <HudButton
              title={favoriteActive ? '★ REMOVE FROM FAVORITES' : '★ ADD TO FAVORITES'}
              onPress={() => toggleFavorite(hero.id)}
              variant={favoriteActive ? 'secondary' : 'outline'}
              size="md"
              style={styles.favoriteButton}
            />

            {isAdmin && (
              <HudButton
                title="EDIT OPERATIVE"
                onPress={() => navigation.navigate('MainTabs', { screen: 'HeroForm', params: { heroId: hero.id } })}
                variant="primary"
                size="md"
                style={{ marginTop: 12, width: '100%' }}
              />
            )}
          </HudCard>

          {/* Power Level Assessment Section */}
          <Text style={styles.sectionTitle}>THREAT & POWER ASSESSMENT</Text>
          <HudCard style={styles.sectionCard}>
            <View style={styles.powerGaugeHeader}>
              <View>
                <Text style={styles.powerAssessmentLabel}>ENERGY & COMBAT SCALE</Text>
                <Text style={styles.powerTierLabel}>
                  CLASSIFICATION:{' '}
                  <Text style={{ color: getPowerColor(hero.nivel_poder) }}>
                    {hero.nivel_poder >= 90
                      ? 'OMEGA LEVEL (COSMIC)'
                      : hero.nivel_poder >= 75
                      ? 'ALPHA LEVEL (SUPERIOR)'
                      : hero.nivel_poder >= 50
                      ? 'BETA LEVEL (STANDARD)'
                      : 'GAMMA LEVEL (TACTICAL)'}
                  </Text>
                </Text>
              </View>
              <View style={styles.powerNumberCircle}>
                <Text style={[styles.powerLargeNumber, { color: getPowerColor(hero.nivel_poder) }]}>
                  {hero.nivel_poder}
                </Text>
                <Text style={styles.powerOutOf}>/100</Text>
              </View>
            </View>

            <PowerBar level={hero.nivel_poder} showLabel={false} style={styles.powerMeterLarge} />
          </HudCard>

          {/* Primary Ability & Tactical Skills */}
          <Text style={styles.sectionTitle}>PRIMARY ABILITY & SKILLS</Text>
          <HudCard style={styles.sectionCard}>
            <View style={styles.abilityRow}>
              <Ionicons name="flash" size={20} color={colors.primary} style={styles.abilityIcon} />
              <Text style={styles.abilityTitle}>REGISTERED PRIMARY ABILITY</Text>
            </View>
            <Text style={styles.abilityDescription}>{hero.poder_principal.toUpperCase()}</Text>
          </HudCard>

          {/* S.H.I.E.L.D. Metadata Footer */}
          <View style={styles.metadataFooter}>
            <Text style={styles.metadataText}>DOSSIER CLASSIFIED LEVEL 7 // S.H.I.E.L.D.</Text>
            <Text style={styles.metadataSubtext}>
              LAST UPDATED IN CENTRAL DATABASE
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCyan,
    backgroundColor: colors.surfaceGlass,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
    letterSpacing: 1.5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
  },
  favIconButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: colors.borderCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIconButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerCard: {
    marginBottom: 16,
    padding: 16,
  },
  portraitSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  portraitFrame: {
    width: 110,
    height: 140,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    position: 'relative',
    marginRight: 14,
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  portraitPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '35%',
    height: 1,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  heroIdentity: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroCodename: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1.5,
  },
  heroRealName: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
    letterSpacing: 1,
  },
  realNameHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  idBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderCyan,
  },
  idBadgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.textDim,
  },
  favoriteButton: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionCard: {
    marginBottom: 12,
    padding: 16,
  },
  powerGaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  powerAssessmentLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  powerTierLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  powerNumberCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderCyan,
  },
  powerLargeNumber: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 22,
    fontWeight: '900',
  },
  powerOutOf: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 2,
  },
  powerMeterLarge: {
    marginVertical: 4,
  },
  abilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  abilityIcon: {
    marginRight: 6,
  },
  abilityTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  abilityDescription: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  metadataFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  metadataText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 2,
  },
  metadataSubtext: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 8,
    color: colors.textDim,
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default HeroDetailScreen;
