import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { heroesApi, missionsApi } from '../../api';
import { Hero, Mission } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudCard } from '../../components/common/HudCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MainTabNavigationProp } from '../../navigation/types';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const HomeScreen: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigation = useNavigation<MainTabNavigationProp>();

  const [refreshing, setRefreshing] = useState(false);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);

  const loadDashboardStats = useCallback(async () => {
    try {
      const [hData, mData] = await Promise.all([
        heroesApi.getHeroes().catch(() => [] as Hero[]),
        missionsApi.getMissions().catch(() => [] as Mission[]),
      ]);
      setHeroes(hData);
      setMissions(mData);
    } catch {
      // Fallback handled by catch above
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
    
    // Polling every 15 seconds
    const interval = setInterval(() => {
      loadDashboardStats();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadDashboardStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), loadDashboardStats()]);
    setRefreshing(false);
  };

  const handleDelete = (missionId: number, missionTitle: string) => {
    Alert.alert(
      'TERMINATE OPERATION',
      `Are you sure you want to delete OP: ${missionTitle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: async () => {
            try {
              await missionsApi.deleteMission(missionId);
              setMissions(missions.filter(m => m.id !== missionId));
            } catch {
              Alert.alert('Error', 'Failed to delete operation');
            }
          },
        },
      ]
    );
  };

  // Metrics
  const totalAssets = heroes.length;
  const totalMissions = missions.length;
  const activeOps = missions.filter((m) => m.estado === 'EN_PROGRESO').length;
  const pendingMissions = missions.filter((m) => m.estado === 'PENDIENTE').length;
  
  // Sort missions by latest
  const recentMissions = [...missions]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  // Charts Data
  const pieData = [
    {
      name: 'PENDIENTE',
      population: pendingMissions,
      color: colors.secondaryDark,
      legendFontColor: colors.textMuted,
      legendFontSize: 11,
    },
    {
      name: 'EN PROGRESO',
      population: activeOps,
      color: colors.primary,
      legendFontColor: colors.textMuted,
      legendFontSize: 11,
    },
    {
      name: 'COMPLETADA',
      population: missions.filter(m => m.estado === 'COMPLETADA').length,
      color: colors.textMuted,
      legendFontColor: colors.textMuted,
      legendFontSize: 11,
    },
  ];

  // Group missions by date for line chart
  const missionsByDate = missions.reduce((acc, mission) => {
    // Just taking the day and month for brief label
    const dateObj = new Date(mission.fecha);
    const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.keys(missionsByDate).sort();
  const lineLabels = sortedDates.length > 0 ? sortedDates : ['No Data'];
  const lineDataPoints = sortedDates.length > 0 ? sortedDates.map(d => missionsByDate[d]) : [0];

  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        data: lineDataPoints,
        color: (opacity = 1) => `rgba(0, 210, 255, ${opacity})`, // primary color
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'rgba(15, 23, 42, 0)',
    backgroundGradientTo: 'rgba(15, 23, 42, 0)',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.3})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.5})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#00d2ff',
    },
    fillShadowGradientFrom: colors.primary,
    fillShadowGradientTo: 'transparent',
    fillShadowGradientFromOpacity: 0.2,
    fillShadowGradientToOpacity: 0,
    decimalPlaces: 0,
  };

  const isAdmin = user?.rol === 'ADMIN';
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Top Protocol Status Bar */}
        <View style={styles.topProtocolBar}>
          <View style={styles.protocolStatus}>
            <View style={styles.pulseDot} />
            <Text style={styles.protocolText}>SYSTEM STATUS // OPTIMAL</Text>
          </View>
        </View>

        {/* Personalized Greeting */}
        <HudCard variant="glow" style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>Welcome back, {user?.nombre || 'Operator-01'}.</Text>
          <View style={styles.greetingStatus}>
            <View style={styles.liveDot} />
            <Text style={styles.greetingSub}>
              System Status: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>OPTIMAL</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.7}
          >
            <MaterialIcons name="power-settings-new" size={14} color={colors.danger} />
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>
        </HudCard>

        {/* Technical Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* TOTAL ASSETS */}
          <TouchableOpacity 
            style={styles.metricBox} 
            activeOpacity={0.7} 
            onPress={() => navigation.navigate('Heroes')}
          >
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>TOTAL_ASSETS</Text>
              <MaterialIcons name="groups" size={16} color={colors.textMuted} />
            </View>
            <Text style={styles.metricValue}>{totalAssets}</Text>
            <View style={styles.metricBarBg}>
              <View style={[styles.metricBarFill, { width: `${Math.min(100, (totalAssets / 50) * 100)}%` }]} />
            </View>
          </TouchableOpacity>

          {/* TOTAL MISSIONS */}
          <TouchableOpacity 
            style={styles.metricBox} 
            activeOpacity={0.7} 
            onPress={() => navigation.navigate('Missions')}
          >
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>TOTAL_MISSIONS</Text>
              <MaterialIcons name="route" size={16} color={colors.textMuted} />
            </View>
            <Text style={styles.metricValue}>{totalMissions}</Text>
            <View style={styles.metricFooter}>
              <MaterialIcons name="trending-up" size={12} color={colors.primary} />
              <Text style={styles.metricFooterText}>LIVE TRACKING</Text>
            </View>
          </TouchableOpacity>

          {/* ACTIVE OPS */}
          <TouchableOpacity 
            style={styles.metricBox} 
            activeOpacity={0.7} 
            onPress={() => navigation.navigate('Missions')}
          >
            <View style={styles.metricHeader}>
              <Text style={[styles.metricLabel, { color: colors.primary }]}>ACTIVE_OPS</Text>
              <MaterialIcons name="my-location" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.metricValue, { color: colors.primary }]}>
              {activeOps.toString().padStart(2, '0')}
            </Text>
            <View style={styles.metricBarsRow}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={[styles.miniBar, i < activeOps ? { backgroundColor: colors.primary } : {}]} />
              ))}
            </View>
          </TouchableOpacity>

          {/* PENDING PROTOCOLS */}
          <TouchableOpacity 
            style={styles.metricBox} 
            activeOpacity={0.7} 
            onPress={() => navigation.navigate('Missions')}
          >
            <View style={styles.metricHeader}>
              <Text style={[styles.metricLabel, { color: colors.secondaryDark }]}>PENDING_PROTOCOLS</Text>
              <MaterialIcons name="warning" size={16} color={colors.secondaryDark} />
            </View>
            <Text style={[styles.metricValue, { color: colors.secondaryDark }]}>
              {pendingMissions.toString().padStart(2, '0')}
            </Text>
            <View style={styles.metricFooter}>
              <Text style={[styles.metricFooterText, { color: colors.secondaryDark }]}>
                {pendingMissions > 0 ? 'REQUIRES_AUTHORIZATION' : 'ALL_CLEAR'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Real-Time Metrics Visualization */}
        <HudCard style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <MaterialIcons name="trending-up" size={16} color={colors.primary} />
            <Text style={styles.chartTitle}>OPERATION TRENDS</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={lineChartData}
              width={Math.max(screenWidth - 64, lineChartData.labels.length * 60)}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chartStyle}
              withInnerLines={false}
            />
          </ScrollView>
        </HudCard>

        <HudCard style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <MaterialIcons name="donut-large" size={16} color={colors.primary} />
            <Text style={styles.chartTitle}>STATUS DISTRIBUTION</Text>
          </View>
          <PieChart
            data={pieData}
            width={screenWidth - 64}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
          />
        </HudCard>

        {/* Recent Intelligence (Grid) */}
        <HudCard style={styles.recentGridCard}>
          <View style={styles.chartHeader}>
            <MaterialIcons name="view-list" size={16} color={colors.primary} />
            <Text style={styles.chartTitle}>RECENT_INTELLIGENCE</Text>
          </View>

          {recentMissions.length === 0 ? (
            <Text style={styles.noDataText}>NO RECORDS FOUND</Text>
          ) : (
            recentMissions.map((mission) => {
              const hero = heroes.find(h => h.id === mission.superheroe_id);
              return (
                <View key={mission.id} style={styles.gridRow}>
                  <View style={styles.gridRowHeader}>
                    <Text style={styles.gridOpId}>#OP-{mission.id.toString().padStart(3, '0')}</Text>
                    <Text style={styles.gridDate}>{new Date(mission.fecha).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.gridTitle}>{mission.titulo}</Text>
                  
                  <View style={styles.gridDetails}>
                    <StatusBadge type="mission_status" value={mission.estado} />
                    <Text style={styles.gridAssigned}>
                      {hero ? hero.nombre.toUpperCase() : 'UNASSIGNED'}
                    </Text>
                  </View>

                  {isAdmin && (
                    <View style={styles.gridActions}>
                      <TouchableOpacity 
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('MissionForm', { missionId: mission.id })}
                      >
                        <MaterialIcons name="edit" size={16} color={colors.secondaryDark} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionBtn}
                        onPress={() => handleDelete(mission.id, mission.titulo)}
                      >
                        <MaterialIcons name="delete" size={16} color={colors.dangerHigh} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )
            })
          )}
        </HudCard>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topProtocolBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  protocolStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  protocolText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primaryMuted,
    letterSpacing: 1,
  },
  greetingCard: {
    padding: 20,
    marginBottom: 16,
  },
  greetingTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: colors.primary,
    marginBottom: 8,
  },
  greetingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  greetingSub: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primaryMuted,
    textTransform: 'uppercase',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 61, 113, 0.3)',
    backgroundColor: 'rgba(255, 61, 113, 0.1)',
  },
  logoutText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
    letterSpacing: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricBox: {
    width: '48%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  metricLabel: {
    fontWeight: '700',
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    flex: 1,
  },
  metricValue: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 28,
    color: colors.text,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricBarBg: {
    height: 4,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  metricFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricFooterText: {
    fontWeight: '500',
    fontSize: 9,
    color: colors.primary,
  },
  metricBarsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 4,
  },
  miniBar: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 2,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  chartTitle: {
    fontWeight: '700',
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 8,
  },
  recentGridCard: {
    padding: 16,
  },
  noDataText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 16,
  },
  gridRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
  },
  gridRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridOpId: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.primary,
  },
  gridDate: {
    fontWeight: '500',
    fontSize: 10,
    color: colors.textMuted,
  },
  gridTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 14,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gridDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridAssigned: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.textMuted,
  },
  gridActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 16,
  },
  actionBtn: {
    padding: 4,
  },
});
