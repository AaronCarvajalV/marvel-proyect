import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mission, MissionThreatLevel, MissionStatus } from '../../types';
import { missionsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { MissionCard } from '../../components/missions/MissionCard';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { HeaderHUD } from '../../components/common/HeaderHUD';
import { HudButton } from '../../components/common/HudButton';
import { RootStackNavigationProp } from '../../navigation/types';

export const MissionsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

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
      let msg = 'Failed to retrieve tactical missions from the server.';
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

  const handleDelete = (missionId: number, missionTitle: string) => {
    Alert.alert(
      'TERMINATE PROTOCOL',
      `Are you sure you want to delete mission: ${missionTitle}? This action cannot be reversed.`,
      [
        { text: 'CANCEL', style: 'cancel' },
        { 
          text: 'TERMINATE', 
          style: 'destructive',
          onPress: async () => {
            try {
              await missionsApi.deleteMission(missionId);
              fetchMissions();
            } catch (err: any) {
              Alert.alert('SYSTEM ERROR', err.message || 'Failed to delete mission');
            }
          }
        }
      ]
    );
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

  const threatLabels: Record<'ALL' | MissionThreatLevel, string> = {
    'ALL': 'ALL',
    'BAJO': 'LOW',
    'MEDIO': 'MEDIUM',
    'ALTO': 'HIGH',
  };

  const statusLabels: Record<'ALL' | MissionStatus, string> = {
    'ALL': 'ALL',
    'PENDIENTE': 'PENDING',
    'EN_PROGRESO': 'IN PROGRESS',
    'COMPLETADA': 'COMPLETED',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HeaderHUD
        title="MISSIONS"
        subtitle={`GLOBAL REGISTRY: ${filteredMissions.length} MISSIONS`}
      />

      {/* Filter Tabs Section */}
      <View style={styles.filterSection}>
        {/* Threat Level Filter Tabs */}
        <Text style={styles.filterHeader}>THREAT LEVEL:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsRow}
        >
          {(['ALL', 'BAJO', 'MEDIO', 'ALTO'] as const).map((threat) => {
            const isSelected = threatFilter === threat;
            const getThreatBorder = () => {
              if (!isSelected) return colors.borderCyan;
              if (threat === 'ALTO') return colors.dangerHigh;
              if (threat === 'MEDIO') return colors.dangerMedium;
              return colors.primary;
            };
            const getThreatBg = () => {
              if (!isSelected) return colors.surfaceGlass;
              if (threat === 'ALTO') return 'rgba(255, 61, 113, 0.15)';
              if (threat === 'MEDIO') return 'rgba(255, 170, 0, 0.15)';
              return colors.primaryGlow;
            };

            return (
              <TouchableOpacity
                key={threat}
                style={[
                  styles.filterTab,
                  { borderColor: getThreatBorder(), backgroundColor: getThreatBg() },
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
                  {threatLabels[threat]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Status Filter Tabs */}
        <Text style={[styles.filterHeader, { marginTop: 12 }]}>MISSION STATUS:</Text>
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
                  {statusLabels[status]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isAdmin && (
          <HudButton
            title="NEW MISSION"
            onPress={() => navigation.navigate('MissionForm', {})}
            variant="primary"
            size="md"
            style={{ marginTop: 12 }}
          />
        )}
      </View>

      {/* Main Content Area */}
      {isLoading && !refreshing ? (
        <LoadingOverlay message="DOWNLOADING MISSION TELEMETRY..." fullscreen />
      ) : error ? (
        <View style={styles.centerContainer}>
          <ErrorMessage
            title="MISSION LINK FAILURE"
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
              onPressEdit={isAdmin ? (id: number) => navigation.navigate('MissionForm', { missionId: id }) : undefined}
              onPressDelete={isAdmin ? handleDelete : undefined}
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
              icon="navigate-circle-outline"
              title="NO ACTIVE MISSIONS"
              message="No tactical missions found matching the selected threat or status filters."
              actionTitle="RESET FILTERS"
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
    backgroundColor: colors.backgroundDark,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCyan,
  },
  filterHeader: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  filterTabsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderCyan,
    backgroundColor: colors.surfaceGlass,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActivePrimary: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
  },
  filterTabText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  filterTabTextPrimary: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Allow for tab bar
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});

export default MissionsScreen;
