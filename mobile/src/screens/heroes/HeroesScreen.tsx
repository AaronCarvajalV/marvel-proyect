import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Hero } from '../../types';
import { heroesApi } from '../../api';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HeroCard } from '../../components/heroes/HeroCard';
import { HudInput } from '../../components/common/HudInput';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { HeaderHUD } from '../../components/common/HeaderHUD';
import { HudButton } from '../../components/common/HudButton';
import { RootStackNavigationProp } from '../../navigation/types';

export const HeroesScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [segment, setSegment] = useState<'ALL' | 'FAVORITES'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroes = useCallback(async () => {
    setError(null);
    try {
      const data = await heroesApi.getHeroes();
      setHeroes(data);
    } catch (err: unknown) {
      let msg = 'Failed to establish tactical link to main database.';
      if (err && typeof err === 'object' && 'message' in err) {
        msg = String((err as { message: string }).message);
      }
      setError(msg);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHeroes();
  };

  const filteredHeroes = useMemo(() => {
    return heroes.filter((hero) => {
      const matchesSearch =
        searchQuery === '' ||
        hero.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hero.nombre_real.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hero.poder_principal.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSegment =
        segment === 'ALL' || (segment === 'FAVORITES' && isFavorite(hero.id));

      return matchesSearch && matchesSegment;
    });
  }, [heroes, searchQuery, segment, isFavorite]);

  const handleHeroPress = (hero: Hero) => {
    navigation.navigate('HeroDetail', { heroId: hero.id, heroName: hero.nombre });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HeaderHUD
        title="NETWORK"
        subtitle={`OPERATIVES: ${filteredHeroes.length}`}
      />

      <View style={styles.filterSection}>
        {/* Search Input */}
        <HudInput
          placeholder="SEARCH IDENTITY, ALIAS, OR POWER..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          rightIcon={searchQuery ? 'close-circle-outline' : undefined}
          onRightIconPress={() => setSearchQuery('')}
          containerStyle={styles.searchInput}
        />

        {/* Segments: ALL / FAVORITES */}
        <View style={styles.filterChipsRow}>
          {(['ALL', 'FAVORITES'] as const).map((filter) => {
            const isSelected = segment === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setSegment(filter)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Operative Button (Admin Only) */}
        {isAdmin && (
          <HudButton
            title="NEW OPERATIVE"
            onPress={() => navigation.navigate('HeroForm', {})}
            variant="primary"
            size="md"
            style={{ marginTop: 12 }}
          />
        )}
      </View>

      {/* Main Content Area */}
      {isLoading && !refreshing ? (
        <LoadingOverlay message="DOWNLOADING SECURE DOSSIERS..." fullscreen />
      ) : error ? (
        <View style={styles.centerContainer}>
          <ErrorMessage
            title="TACTICAL LINK FAILURE"
            message={error}
            onRetry={fetchHeroes}
          />
        </View>
      ) : (
        <FlatList
          data={filteredHeroes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HeroCard
              hero={item}
              onPress={() => handleHeroPress(item)}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon={segment === 'FAVORITES' && !searchQuery ? "star-outline" : "search-outline"}
              title={segment === 'FAVORITES' && !searchQuery ? "NO FAVORITES" : "NO MATCHES FOUND"}
              message={
                searchQuery
                  ? `No operatives found matching "${searchQuery}".`
                  : segment === 'FAVORITES'
                  ? 'Star an operative to pin them to your priority network.'
                  : 'No operatives found in the current database.'
              }
              actionTitle={searchQuery ? 'CLEAR SEARCH' : 'RELOAD DATABASE'}
              onAction={searchQuery ? () => setSearchQuery('') : fetchHeroes}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCyan,
    backgroundColor: colors.backgroundDark,
  },
  searchInput: {
    marginBottom: 12,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    backgroundColor: colors.surfaceGlass,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  filterChipTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Added bottom padding for tab bar
  },
  centerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});

export default HeroesScreen;
