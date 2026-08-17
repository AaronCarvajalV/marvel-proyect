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
import { heroesApi } from '../../api';
import { Hero } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudInput } from '../../components/common/HudInput';
import { HudButton } from '../../components/common/HudButton';
import { HudCard } from '../../components/common/HudCard';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';

// Need to type the route.
// Using generic 'any' here for speed, but matching RootStackParamList
export const HeroFormScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const heroId = route.params?.heroId as number | undefined;

  const isEditing = !!heroId;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  // Form State
  const [nombre, setNombre] = useState('');
  const [nombreReal, setNombreReal] = useState('');
  const [poderPrincipal, setPoderPrincipal] = useState('');
  const [nivelPoder, setNivelPoder] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [estado, setEstado] = useState<'ACTIVO' | 'INACTIVO'>('ACTIVO');

  useEffect(() => {
    if (isEditing) {
      fetchHero();
    }
  }, [isEditing]);

  const fetchHero = async () => {
    try {
      const data = await heroesApi.getHeroById(heroId!);
      setNombre(data.nombre);
      setNombreReal(data.nombre_real);
      setPoderPrincipal(data.poder_principal);
      setNivelPoder(data.nivel_poder.toString());
      setImagenUrl(data.imagen_url || '');
      setEstado(data.estado);
    } catch (error) {
      Alert.alert('Error', 'Failed to load operative dossier.');
      navigation.goBack();
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    if (!nombre || !nombreReal || !poderPrincipal || !nivelPoder) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
      return;
    }

    const payload: Partial<Hero> = {
      nombre,
      nombre_real: nombreReal,
      poder_principal: poderPrincipal,
      nivel_poder: parseInt(nivelPoder, 10) || 0,
      imagen_url: imagenUrl,
      estado,
    };

    setIsLoading(true);
    try {
      if (isEditing) {
        await heroesApi.updateHero(heroId!, payload);
        Alert.alert('Success', 'Operative updated successfully.');
      } else {
        await heroesApi.createHero(payload);
        Alert.alert('Success', 'Operative registered successfully.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save operative data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <LoadingOverlay message="LOADING CLASSIFIED DOSSIER..." fullscreen />;
  }

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
            {isEditing ? `EDIT OPERATIVE #${heroId}` : 'NEW OPERATIVE'}
          </Text>
        </View>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <HudCard variant="default">
            <HudInput
              label="CODENAME (NOMBRE)"
              value={nombre}
              onChangeText={setNombre}
              placeholder="e.g. SPIDER-MAN"
            />
            <HudInput
              label="REAL IDENTITY (NOMBRE REAL)"
              value={nombreReal}
              onChangeText={setNombreReal}
              placeholder="e.g. PETER PARKER"
            />
            <HudInput
              label="PRIMARY ABILITY"
              value={poderPrincipal}
              onChangeText={setPoderPrincipal}
              placeholder="e.g. WALL-CRAWLING, SPIDER-SENSE"
            />
            <HudInput
              label="POWER LEVEL (0-100)"
              value={nivelPoder}
              onChangeText={setNivelPoder}
              placeholder="e.g. 85"
              keyboardType="numeric"
            />
            <HudInput
              label="PORTRAIT URL"
              value={imagenUrl}
              onChangeText={setImagenUrl}
              placeholder="https://..."
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.statusToggleContainer}>
              <Text style={styles.label}>OPERATIONAL STATUS:</Text>
              <View style={styles.toggleRow}>
                <HudButton
                  title="ACTIVO"
                  onPress={() => setEstado('ACTIVO')}
                  variant={estado === 'ACTIVO' ? 'primary' : 'outline'}
                  size="sm"
                  style={{ flex: 1, marginRight: 8 }}
                />
                <HudButton
                  title="INACTIVO"
                  onPress={() => setEstado('INACTIVO')}
                  variant={estado === 'INACTIVO' ? 'secondary' : 'outline'}
                  size="sm"
                  style={{ flex: 1, marginLeft: 8 }}
                />
              </View>
            </View>

            <HudButton
              title={isEditing ? 'UPDATE PROTOCOL' : 'AUTHORIZE REGISTRATION'}
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 16,
  },
  statusToggleContainer: {
    marginTop: 16,
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
