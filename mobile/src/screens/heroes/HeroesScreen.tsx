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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HeroCard } from '../../components/heroes/HeroCard';
import { HudInput } from '../../components/common/HudInput';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { HeaderHUD } from '../../components/common/HeaderHUD';
import { RootStackNavigationProp } from '../../navigation/types';

export const HeroesScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVO' | 'INACTIVO'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroes = useCallback(async () => {
    setError(null);
    try {
      const data = await heroesApi.getHeroes();
      setHeroes(data);
    } catch (err: unknown) {
      let msg = 'No se pudo conectar a la base de datos de superhéroes.';
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

      const matchesStatus =
        statusFilter === 'ALL' || hero.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [heroes, searchQuery, statusFilter]);

  const handleHeroPress = (hero: Hero) => {
    navigation.navigate('HeroDetail', { heroId: hero.id, heroName: hero.nombre });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HeaderHUD
        title="BASE DE SUPERHÉROES"
        subtitle={`REGISTROS: ${heroes.length} OPERATIVOS`}
      />

      <View style={styles.filterSection}>
        {/* Search Input */}
        <HudInput
          placeholder="Buscar por nombre, alias o poder..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          rightIcon={searchQuery ? 'close-circle-outline' : undefined}
          onRightIconPress={() => setSearchQuery('')}
          containerStyle={styles.searchInput}
        />

        {/* Status Filter Chips */}
        <View style={styles.filterChipsRow}>
          {(['ALL', 'ACTIVO', 'INACTIVO'] as const).map((filter) => {
            const isSelected = statusFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setStatusFilter(filter)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {filter === 'ALL' ? 'TODOS' : filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Main Content Area */}
      {isLoading && !refreshing ? (
        <LoadingOverlay message="CARGANDO ARCHIVOS DE SUPERHÉROES..." fullscreen />
      ) : error ? (
        <View style={styles.centerContainer}>
          <ErrorMessage
            title="FALLA DE ENLACE TÁCTICO"
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
              icon="search-outline"
              title="SIN COINCIDENCIAS"
              message={
                searchQuery
                  ? `No se encontraron operativos que coincidan con "${searchQuery}".`
                  : 'No hay superhéroes registrados en el sistema.'
              }
              actionTitle={searchQuery ? 'LIMPIAR BÚSQUEDA' : 'RECARGAR'}
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
    backgroundColor: colors.background,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundDark,
  },
  searchInput: {
    marginBottom: 8,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
  },
  filterChipText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  filterChipTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});

export default HeroesScreen;
