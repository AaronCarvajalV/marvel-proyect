import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mission, MissionThreatLevel, MissionStatus } from '../../types';
import { missionsApi } from '../../api';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { MissionCard } from '../../components/missions/MissionCard';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { HeaderHUD } from '../../components/common/HeaderHUD';
import { RootStackNavigationProp } from '../../navigation/types';

export const MissionsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [threatFilter, setThreatFilter] = useState<'ALL' | MissionThreatLevel>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MissionStatus>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    setError(null);
    try {
      const data = await missionsApi.getMissions();
      setMissions(data);
    } catch (err: unknown) {
      let msg = 'No se pudieron recuperar las misiones tácticas del servidor.';
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
    fetchMissions();
  }, [fetchMissions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMissions();
  };

  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      const matchesThreat =
        threatFilter === 'ALL' || mission.nivel_peligro === threatFilter;
      const matchesStatus =
        statusFilter === 'ALL' || mission.estado === statusFilter;
      return matchesThreat && matchesStatus;
    });
  }, [missions, threatFilter, statusFilter]);

  const handleHeroPress = (heroId: number) => {
    navigation.navigate('HeroDetail', { heroId });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HeaderHUD
        title="OPERACIONES TÁCTICAS"
        subtitle={`REGISTRO GLOBAL: ${missions.length} MISIONES`}
      />

      {/* Filter Tabs Section */}
      <View style={styles.filterSection}>
        {/* Threat Level Filter Tabs */}
        <Text style={styles.filterHeader}>NIVEL DE PELIGRO:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
        >
          {(['ALL', 'BAJO', 'MEDIO', 'ALTO'] as const).map((threat) => {
            const isSelected = threatFilter === threat;
            const getThreatBorder = () => {
              if (!isSelected) return colors.border;
              if (threat === 'ALTO') return colors.dangerHigh;
              if (threat === 'MEDIO') return colors.dangerMedium;
              return colors.primary;
            };

            return (
              <TouchableOpacity
                key={threat}
                style={[
                  styles.filterTab,
                  { borderColor: getThreatBorder() },
                  isSelected && styles.filterTabActive,
                ]}
                onPress={() => setThreatFilter(threat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isSelected && { color: getThreatBorder(), fontWeight: '800' },
                  ]}
                >
                  {threat === 'ALL' ? 'TODOS' : `PELIGRO ${threat}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Status Filter Tabs */}
        <Text style={[styles.filterHeader, { marginTop: 6 }]}>ESTADO DE MISIÓN:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
        >
          {(['ALL', 'PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] as const).map((status) => {
            const isSelected = statusFilter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterTab,
                  isSelected && styles.filterTabActivePrimary,
                ]}
                onPress={() => setStatusFilter(status)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isSelected && styles.filterTabTextPrimary,
                  ]}
                >
                  {status === 'ALL' ? 'TODOS' : status.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      {isLoading && !refreshing ? (
        <LoadingOverlay message="DESCARGANDO TELEMETRÍA DE MISIONES..." fullscreen />
      ) : error ? (
        <View style={styles.centerContainer}>
          <ErrorMessage
            title="FALLA DE ENLACE DE MISIONES"
            message={error}
            onRetry={fetchMissions}
          />
        </View>
      ) : (
        <FlatList
          data={filteredMissions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MissionCard
              mission={item}
              onPressHero={handleHeroPress}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.dangerHigh}
              colors={[colors.dangerHigh]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="navigate-circle-outline"
              title="SIN MISIONES ACTIVAS"
              message="No existen misiones tácticas que coincidan con los filtros de peligro o estado seleccionados."
              actionTitle="RESTABLECER FILTROS"
              onAction={() => {
                setThreatFilter('ALL');
                setStatusFilter('ALL');
              }}
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
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterHeader: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  filterTabsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterTabActive: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  filterTabActivePrimary: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
  },
  filterTabText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  filterTabTextPrimary: {
    color: colors.primary,
    fontWeight: '800',
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

export default MissionsScreen;
