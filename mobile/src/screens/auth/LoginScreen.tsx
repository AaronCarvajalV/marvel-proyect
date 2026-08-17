import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudCard } from '../../components/common/HudCard';
import { HudButton } from '../../components/common/HudButton';
import { HudInput } from '../../components/common/HudInput';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  getApiBaseUrl,
  saveCustomApiBaseUrl,
  resetCustomApiBaseUrl,
  DEFAULT_API_BASE_URL,
} from '../../config/env';
import { updateApiClientBaseUrl } from '../../api/client';

export const LoginScreen: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Network Configuration Modal
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState(getApiBaseUrl());

  const handleLogin = async () => {
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError('Ingrese su identificador o correo electrónico institucional.');
      return;
    }

    if (!password) {
      setLocalError('Ingrese su clave de acceso de seguridad.');
      return;
    }

    await login(email, password);
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setLocalError(null);
    clearError();
  };

  const handleSaveApiUrl = async () => {
    try {
      await saveCustomApiBaseUrl(customUrl);
      updateApiClientBaseUrl(getApiBaseUrl());
      setIsConfigModalVisible(false);
      Alert.alert('Configuración Guardada', `Endpoint activo: ${getApiBaseUrl()}`);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la URL de la API');
    }
  };

  const handleResetApiUrl = async () => {
    await resetCustomApiBaseUrl();
    setCustomUrl(getApiBaseUrl());
    updateApiClientBaseUrl(getApiBaseUrl());
    Alert.alert('Restablecido', `Endpoint predeterminado: ${DEFAULT_API_BASE_URL}`);
  };

  const displayError = localError || error;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top System Bar */}
          <View style={styles.topBar}>
            <View style={styles.securityStatus}>
              <View style={styles.liveDot} />
              <Text style={styles.securityText}>S.H.I.E.L.D. SECURE PROTOCOL // 256-BIT ENCRYPTION</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsConfigModalVisible(true)}
              style={styles.configButton}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Logo & Header */}
          <View style={styles.headerSection}>
            <View style={styles.arcReactorContainer}>
              <View style={styles.arcOuterRing}>
                <View style={styles.arcInnerRing}>
                  <Ionicons name="shield-half" size={40} color={colors.primary} />
                </View>
              </View>
            </View>

            <Text style={styles.title}>MARVEL MISSION CONTROL</Text>
            <Text style={styles.subtitle}>S.H.I.E.L.D. CENTRAL TACTICAL COMMAND</Text>
            <Text style={styles.terminalPrompt}>AUTENTICACIÓN DE AGENTE REQUERIDA</Text>
          </View>

          {/* Login Card */}
          <HudCard variant="glow" style={styles.card}>
            {displayError && (
              <ErrorMessage
                title="ACCESO DENEGADO"
                message={displayError}
                style={styles.errorBanner}
              />
            )}

            <HudInput
              label="CORREO ELECTRÓNICO / AGENT ID"
              placeholder="agente@shield.gov"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (localError) setLocalError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              leftIcon="mail-outline"
            />

            <HudInput
              label="CLAVE DE SEGURIDAD / ACCESS KEY"
              placeholder="••••••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (localError) setLocalError(null);
              }}
              isPassword
              leftIcon="lock-closed-outline"
            />

            <HudButton
              title="AUTORIZAR ACCESO AL SISTEMA"
              onPress={handleLogin}
              loading={isLoading}
              variant="primary"
              size="lg"
              style={styles.loginButton}
              icon={<Ionicons name="finger-print-outline" size={20} color={colors.backgroundDark} />}
            />

            {/* Quick-Fill Credentials for Academic Review */}
            <View style={styles.quickFillSection}>
              <Text style={styles.quickFillLabel}>CREDENCIALES DE PRUEBA RÁPIDA:</Text>
              <View style={styles.quickFillButtonsRow}>
                <HudButton
                  title="ADMIN (NICK FURY)"
                  onPress={() => handleQuickFill('admin@shield.gov', 'Admin1234!')}
                  variant="secondary"
                  size="sm"
                  style={styles.quickButton}
                />
                <HudButton
                  title="CONSULTA (COULSON)"
                  onPress={() => handleQuickFill('consulta@shield.gov', 'Consulta1234!')}
                  variant="outline"
                  size="sm"
                  style={styles.quickButton}
                />
              </View>
            </View>
          </HudCard>

          {/* Footer Telemetry */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              CONEXIÓN DIRECTA REST API: {getApiBaseUrl()}
            </Text>
            <Text style={styles.footerSubtext}>
              STRATEGIC HOMELAND INTERVENTION, ENFORCEMENT AND LOGISTICS DIVISION
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Network Configuration Modal */}
      <Modal
        visible={isConfigModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsConfigModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <HudCard variant="glow" style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="server-outline" size={24} color={colors.primary} />
              <Text style={styles.modalTitle}>CONFIGURACIÓN DE ENLACE API</Text>
            </View>

            <Text style={styles.modalDescription}>
              Ajuste la dirección IP del servidor backend Laravel según su entorno de red local:
            </Text>

            <HudInput
              label="API_BASE_URL"
              value={customUrl}
              onChangeText={setCustomUrl}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="link-outline"
            />

            <View style={styles.modalActions}>
              <HudButton
                title="GUARDAR Y APLICAR"
                onPress={handleSaveApiUrl}
                variant="primary"
                size="md"
                style={styles.modalActionButton}
              />
              <HudButton
                title="RESTABLECER IP POR DEFECTO"
                onPress={handleResetApiUrl}
                variant="outline"
                size="sm"
                style={styles.modalActionButton}
              />
              <HudButton
                title="CANCELAR"
                onPress={() => setIsConfigModalVisible(false)}
                variant="ghost"
                size="sm"
                style={styles.modalActionButton}
              />
            </View>
          </HudCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.statusActive,
    marginRight: 6,
  },
  securityText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  configButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderCyan,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  arcReactorContainer: {
    marginBottom: 16,
  },
  arcOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  arcInnerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  terminalPrompt: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    padding: 20,
  },
  errorBanner: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  quickFillSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginTop: 8,
  },
  quickFillLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  quickFillButtonsRow: {
    gap: 8,
  },
  quickButton: {
    width: '100%',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 8,
    color: colors.textDim,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
    marginLeft: 10,
  },
  modalDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  modalActions: {
    gap: 10,
    marginTop: 10,
  },
  modalActionButton: {
    width: '100%',
  },
});

export default LoginScreen;
