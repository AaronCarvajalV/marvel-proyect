import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { heroesApi, missionsApi } from '../../api';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudCard } from '../../components/common/HudCard';
import { HudButton } from '../../components/common/HudButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getApiBaseUrl } from '../../config/env';
import { MainTabNavigationProp } from '../../navigation/types';

export const HomeScreen: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigation = useNavigation<MainTabNavigationProp>();

  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalHeroes: 0,
    activeHeroes: 0,
    totalMissions: 0,
    activeMissions: 0,
    loading: true,
  });

  const loadDashboardStats = useCallback(async () => {
    try {
      const [heroes, missions] = await Promise.all([
        heroesApi.getHeroes().catch(() => []),
        missionsApi.getMissions().catch(() => []),
      ]);

      const activeHeroesCount = heroes.filter((h) => h.estado === 'ACTIVO').length;
      const activeMissionsCount = missions.filter((m) => m.estado !== 'COMPLETADA').length;

      setStats({
        totalHeroes: heroes.length,
        activeHeroes: activeHeroesCount,
        totalMissions: missions.length,
        activeMissions: activeMissionsCount,
        loading: false,
      });
    } catch {
      setStats((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), loadDashboardStats()]);
    setRefreshing(false);
  };

  const handleLogoutConfirm = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Desea cerrar la terminal y desconectar el enlace seguro de S.H.I.E.L.D.?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desconectar',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const userName = user?.nombre || 'AGENTE';
  const userRole = user?.rol || 'CONSULTA';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
        {/* Top Protocol Status Bar */}
        <View style={styles.topProtocolBar}>
          <View style={styles.protocolStatus}>
            <View style={styles.pulseDot} />
            <Text style={styles.protocolText}>JARVIS PROTOCOL // ONLINE</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogoutConfirm}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Ionicons name="power-outline" size={16} color={colors.dangerHigh} />
            <Text style={styles.logoutText}>SALIR</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome & Agent Profile Hero Card */}
        <HudCard variant="glow" style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeLabel}>WELCOME BACK,</Text>
              <Text style={styles.agentName} numberOfLines={1}>
                {userName.toUpperCase()}
              </Text>
              <Text style={styles.agentEmail}>{user?.email || 'authenticated@shield.gov'}</Text>
            </View>
          </View>

          <View style={styles.clearanceDivider} />

          <View style={styles.clearanceRow}>
            <Text style={styles.clearanceLabel}>NIVEL DE ACCESO:</Text>
            <StatusBadge type="clearance" value={userRole} />
          </View>
        </HudCard>

        {/* Tactical Telemetry Counters */}
        <Text style={styles.sectionHeader}>TELEMETRÍA GLOBAL DEL SISTEMA</Text>
        <View style={styles.telemetryGrid}>
          {/* Active Heroes Counter */}
          <HudCard style={styles.telemetryCard}>
            <Ionicons name="people-outline" size={24} color={colors.primary} style={styles.cardIcon} />
            <Text style={styles.telemetryNumber}>{stats.activeHeroes}</Text>
            <Text style={styles.telemetryLabel}>HÉROES ACTIVOS</Text>
            <Text style={styles.telemetrySubtext}>TOTAL REGISTRADOS: {stats.totalHeroes}</Text>
          </HudCard>

          {/* Active Missions Counter */}
          <HudCard style={styles.telemetryCard}>
            <Ionicons name="flash-outline" size={24} color={colors.dangerMedium} style={styles.cardIcon} />
            <Text style={[styles.telemetryNumber, { color: colors.dangerMedium }]}>
              {stats.activeMissions}
            </Text>
            <Text style={styles.telemetryLabel}>MISIONES EN CURSO</Text>
            <Text style={styles.telemetrySubtext}>TOTAL REGISTRADAS: {stats.totalMissions}</Text>
          </HudCard>

          {/* Bookmarks / Favorites Counter */}
          <HudCard style={styles.telemetryCard}>
            <Ionicons name="star-outline" size={24} color={colors.secondary} style={styles.cardIcon} />
            <Text style={[styles.telemetryNumber, { color: colors.secondary }]}>
              {favoritesCount}
            </Text>
            <Text style={styles.telemetryLabel}>FAVORITOS GUARDADOS</Text>
            <Text style={styles.telemetrySubtext}>EN ASYNC STORAGE</Text>
          </HudCard>

          {/* S.H.I.E.L.D. Uplink Status */}
          <HudCard style={styles.telemetryCard}>
            <Ionicons name="wifi-outline" size={24} color={colors.statusActive} style={styles.cardIcon} />
            <Text style={[styles.telemetryNumber, { color: colors.statusActive, fontSize: 18, marginTop: 4 }]}>
              ENLACE ACTIVO
            </Text>
            <Text style={styles.telemetryLabel}>API REST V1</Text>
            <Text style={styles.telemetrySubtext} numberOfLines={1}>
              {getApiBaseUrl()}
            </Text>
          </HudCard>
        </View>

        {/* Quick Action Navigation Modules */}
        <Text style={styles.sectionHeader}>MÓDULOS DE ACCESO TÁCTICO</Text>

        {/* Module 1: Heroes Database */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Heroes')}
          style={styles.moduleTouch}
        >
          <HudCard variant="glow" style={styles.moduleCard}>
            <View style={styles.moduleContent}>
              <View style={[styles.moduleIconBox, { borderColor: colors.borderCyan }]}>
                <Ionicons name="people" size={28} color={colors.primary} />
              </View>
              <View style={styles.moduleDetails}>
                <Text style={styles.moduleTitle}>BASE DE SUPERHÉROES</Text>
                <Text style={styles.moduleDescription}>
                  Consulta perfiles tácticos, niveles de poder (1-100), habilidades y expedientes clasificados.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </View>
          </HudCard>
        </TouchableOpacity>

        {/* Module 2: Mission Operations */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Missions')}
          style={styles.moduleTouch}
        >
          <HudCard variant="glow" style={styles.moduleCard}>
            <View style={styles.moduleContent}>
              <View style={[styles.moduleIconBox, { borderColor: colors.borderDanger }]}>
                <Ionicons name="navigate-circle" size={28} color={colors.dangerHigh} />
              </View>
              <View style={styles.moduleDetails}>
                <Text style={styles.moduleTitle}>OPERACIONES TÁCTICAS / MISIONES</Text>
                <Text style={styles.moduleDescription}>
                  Supervisión de despliegues globales, niveles de peligro, estados y asignación de operativos.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.dangerHigh} />
            </View>
          </HudCard>
        </TouchableOpacity>

        {/* Module 3: Tactical Favorites */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Favorites')}
          style={styles.moduleTouch}
        >
          <HudCard variant="gold" style={styles.moduleCard}>
            <View style={styles.moduleContent}>
              <View style={[styles.moduleIconBox, { borderColor: colors.borderGold }]}>
                <Ionicons name="star" size={28} color={colors.secondary} />
              </View>
              <View style={styles.moduleDetails}>
                <Text style={styles.moduleTitle}>OPERATIVOS FAVORITOS</Text>
                <Text style={styles.moduleDescription}>
                  Acceso rápido a superhéroes marcados en almacenamiento táctico local offline.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
            </View>
          </HudCard>
        </TouchableOpacity>

        {/* Security Notice / Logout Action */}
        <View style={styles.logoutSection}>
          <HudButton
            title="DESCONECTAR TERMINAL SEGURA"
            onPress={handleLogoutConfirm}
            variant="outline"
            size="md"
            icon={<Ionicons name="power" size={18} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  topProtocolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  protocolStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.statusActive,
    marginRight: 8,
  },
  protocolText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    borderWidth: 1,
    borderColor: colors.borderDanger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoutText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.dangerHigh,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 1,
  },
  profileCard: {
    marginBottom: 20,
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  agentName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  agentEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  clearanceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  clearanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearanceLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  sectionHeader: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 8,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  telemetryCard: {
    width: '48%',
    padding: 12,
  },
  cardIcon: {
    marginBottom: 6,
  },
  telemetryNumber: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 26,
    fontWeight: '900',
    color: colors.primary,
  },
  telemetryLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  telemetrySubtext: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.textDim,
    marginTop: 2,
  },
  moduleTouch: {
    marginBottom: 12,
  },
  moduleCard: {
    padding: 14,
  },
  moduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  moduleDetails: {
    flex: 1,
    marginRight: 8,
  },
  moduleTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
  logoutSection: {
    marginTop: 12,
    marginBottom: 24,
  },
});

export default HomeScreen;
