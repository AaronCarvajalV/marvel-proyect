import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Hero } from '../../types';
import { heroesApi } from '../../api';
import { useFavorites } from '../../context/FavoritesContext';
import { colors } from '../../theme/colors';
import { HeroCard } from '../../components/heroes/HeroCard';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { HeaderHUD } from '../../components/common/HeaderHUD';
import { RootStackNavigationProp, MainTabNavigationProp } from '../../navigation/types';

export const FavoritesScreen: React.FC = () => {
  const rootNavigation = useNavigation<RootStackNavigationProp>();
  const tabNavigation = useNavigation<MainTabNavigationProp>();
  const { favoriteIds, isFavorite, removeFavorite } = useFavorites();

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroes = useCallback(async () => {
    setError(null);
    try {
      const data = await heroesApi.getHeroes();
      setHeroes(data);
    } catch (err: unknown) {
      let msg = 'No se pudo sincronizar la lista de favoritos.';
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

  const favoriteHeroes = useMemo(() => {
    return heroes.filter((hero) => favoriteIds.includes(hero.id));
  }, [heroes, favoriteIds]);

  const handleHeroPress = (hero: Hero) => {
    rootNavigation.navigate('HeroDetail', { heroId: hero.id, heroName: hero.nombre });
  };

  const handleExploreHeroes = () => {
    tabNavigation.navigate('Heroes');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HeaderHUD
        title="OPERATIVOS FAVORITOS"
        subtitle={`REGISTRADOS EN ASYNC STORAGE: ${favoriteIds.length}`}
      />

      {isLoading && !refreshing ? (
        <LoadingOverlay message="SINCRONIZANDO FAVORITOS CON LA API..." fullscreen />
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
          data={favoriteHeroes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HeroCard
              hero={item}
              onPress={() => handleHeroPress(item)}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => removeFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.secondary}
              colors={[colors.secondary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="star-outline"
              title="NO FAVORITE HEROES LOGGED"
              message="No se han registrado operativos favoritos en el almacenamiento táctico local. Marque superhéroes desde el catálogo para visualizarlos aquí."
              actionTitle="EXPLORAR BASE DE SUPERHÉROES"
              onAction={handleExploreHeroes}
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
  listContent: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});

export default FavoritesScreen;
