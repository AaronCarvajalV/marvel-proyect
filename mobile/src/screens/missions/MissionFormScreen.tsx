import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { missionsApi, heroesApi, locationsApi } from '../../api';
import { Mission, Hero, TargetLocation, MissionThreatLevel, MissionStatus } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudInput } from '../../components/common/HudInput';
import { HudButton } from '../../components/common/HudButton';
import { HudCard } from '../../components/common/HudCard';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';

export const MissionFormScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const missionId = route.params?.missionId as number | undefined;

  const isEditing = !!missionId;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [targetLocationId, setTargetLocationId] = useState<number | null>(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [nivelPeligro, setNivelPeligro] = useState<MissionThreatLevel>('BAJO');
  const [estado, setEstado] = useState<MissionStatus>('PENDIENTE');
  const [superheroeId, setSuperheroeId] = useState<number | null>(null);

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [locations, setLocations] = useState<TargetLocation[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [heroesData, locationsData] = await Promise.all([
          heroesApi.getHeroes(),
          locationsApi.getTargetLocations(),
        ]);
        
        setHeroes(heroesData);
        setLocations(locationsData);

        if (!isEditing && locationsData.length > 0) {
          setTargetLocationId(locationsData[0].id);
        }
        if (!isEditing && heroesData.length > 0) {
          setSuperheroeId(heroesData[0].id);
        }

        if (isEditing) {
          const missionData = await missionsApi.getMissionById(missionId!);
          setTitulo(missionData.titulo);
          setDescripcion(missionData.descripcion || '');
          setTargetLocationId(missionData.target_location_id || null);
          setFecha(missionData.fecha);
          setNivelPeligro(missionData.nivel_peligro);
          setEstado(missionData.estado);
          setSuperheroeId(missionData.superheroe_id);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data for form.');
        navigation.goBack();
      } finally {
        setIsFetching(false);
      }
    };
    init();
  }, [isEditing, missionId]);

  const handleSave = async () => {
    if (!titulo || !descripcion || !fecha || !superheroeId || !targetLocationId) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
      return;
    }

    const payload: Partial<Mission> = {
      titulo,
      descripcion,
      target_location_id: targetLocationId,
      fecha,
      nivel_peligro: nivelPeligro,
      estado,
      superheroe_id: superheroeId,
    };

    setIsLoading(true);
    try {
      if (isEditing) {
        await missionsApi.updateMission(missionId!, payload);
        Alert.alert('Success', 'Mission updated successfully.');
      } else {
        await missionsApi.createMission(payload);
        Alert.alert('Success', 'Mission registered successfully.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save mission data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <LoadingOverlay message="LOADING CLASSIFIED DOSSIER..." fullscreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
            {isEditing ? `EDIT MISSION #${missionId}` : 'NEW MISSION'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <HudCard variant="default">
            <HudInput
              label="MISSION TITLE"
              value={titulo}
              onChangeText={setTitulo}
              placeholder="e.g. OPERATION FALLEN SHIELD"
            />
            <HudInput
              label="DESCRIPTION"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Detailed brief of the mission objectives..."
            />
            <HudInput
              label="DATE (YYYY-MM-DD)"
              value={fecha}
              onChangeText={setFecha}
              placeholder="e.g. 2024-05-12"
            />

            {/* Target Location */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>TARGET LOCATION:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {locations.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    style={[
                      styles.heroChip,
                      targetLocationId === loc.id && styles.heroChipActive,
                    ]}
                    onPress={() => setTargetLocationId(loc.id)}
                  >
                    <Text
                      style={[
                        styles.heroChipText,
                        targetLocationId === loc.id && styles.heroChipTextActive,
                      ]}
                    >
                      {loc.name ? `${loc.name} (${loc.city})` : loc.city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Threat Level */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>THREAT LEVEL:</Text>
              <View style={styles.row}>
                {(['BAJO', 'MEDIO', 'ALTO'] as const).map((level) => (
                  <HudButton
                    key={level}
                    title={level}
                    onPress={() => setNivelPeligro(level)}
                    variant={nivelPeligro === level ? 'primary' : 'outline'}
                    size="sm"
                    style={{ flex: 1, marginHorizontal: 4 }}
                  />
                ))}
              </View>
            </View>

            {/* Status */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>MISSION STATUS:</Text>
              <View style={styles.row}>
                {(['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] as const).map((s) => (
                  <HudButton
                    key={s}
                    title={s.replace('_', ' ')}
                    onPress={() => setEstado(s)}
                    variant={estado === s ? 'secondary' : 'outline'}
                    size="sm"
                    style={{ flex: 1, marginHorizontal: 2 }}
                  />
                ))}
              </View>
            </View>

            {/* Hero Assignment */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>ASSIGNED OPERATIVE:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {heroes.map((hero) => (
                  <TouchableOpacity
                    key={hero.id}
                    style={[
                      styles.heroChip,
                      superheroeId === hero.id && styles.heroChipActive,
                    ]}
                    onPress={() => setSuperheroeId(hero.id)}
                  >
                    <Text
                      style={[
                        styles.heroChipText,
                        superheroeId === hero.id && styles.heroChipTextActive,
                      ]}
                    >
                      {hero.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <HudButton
              title={isEditing ? 'UPDATE PROTOCOL' : 'AUTHORIZE DEPLOYMENT'}
              onPress={handleSave}
              loading={isLoading}
              variant="primary"
              size="lg"
              style={{ marginTop: 24 }}
            />
          </HudCard>
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: 80,
  },
  backText: {
    fontWeight: '700',
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 14,
    color: colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.primary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 210, 255, 0.1)',
  },
  heroChipText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  heroChipTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
