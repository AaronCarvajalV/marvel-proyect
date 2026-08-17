import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { HudCard } from '../../components/common/HudCard';
import { HudButton } from '../../components/common/HudButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { HudInput } from '../../components/common/HudInput';

export const LoginScreen: React.FC = () => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    clearError();

    if (isRegistering) {
      if (!name.trim() || !email.trim() || !password || !passwordConfirm) {
        setLocalError('All fields are required for registration.');
        return;
      }
      if (password !== passwordConfirm) {
        setLocalError('Passwords do not match.');
        return;
      }
      await register({
        nombre: name,
        email,
        password,
        password_confirmation: passwordConfirm,
        rol: 'CONSULTA'
      });
    } else {
      if (!email.trim() || !password) {
        setLocalError('Credenciales inválidas o incompletas.');
        return;
      }
      await login(email, password);
    }
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
          {/* Main Cinematic Card Container */}
          <HudCard variant="glow" style={styles.card}>
            {/* System Scan Line */}
            <View style={styles.scanLine} />

            {/* Logo / Branding */}
            <View style={styles.headerSection}>
              <MaterialIcons name="all-inclusive" size={60} color={colors.text} style={styles.logoIcon} />
              <Text style={styles.title}>HEROS ORG.</Text>
              <Text style={styles.subtitle}>
                {isRegistering ? 'NEW OPERATOR REGISTRATION' : 'AUTHENTICATION GATEWAY'}
              </Text>
            </View>

            {/* Error Message */}
            {displayError && (
              <ErrorMessage
                title="ACCESS DENIED"
                message={displayError}
              />
            )}

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {isRegistering && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialIcons name="person" size={14} color={colors.primary} />
                    <Text style={styles.label}>OPERATOR_NAME</Text>
                  </View>
                  <HudInput
                    value={name}
                    onChangeText={setName}
                    placeholder="ENTER FULL NAME"
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="badge" size={14} color={colors.primary} />
                  <Text style={styles.label}>OPERATOR_ID (EMAIL)</Text>
                </View>
                <HudInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ENTER ID SEQUENCE"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name="lock" size={14} color={colors.primary} />
                  <Text style={styles.label}>PASSCODE</Text>
                </View>
                <HudInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              {isRegistering && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialIcons name="lock-reset" size={14} color={colors.primary} />
                    <Text style={styles.label}>CONFIRM_PASSCODE</Text>
                  </View>
                  <HudInput
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    placeholder="••••••••••••"
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
              )}
            </View>

            {/* Submit Action */}
            <HudButton
              title={isRegistering ? 'REGISTER_OPERATOR' : 'INITIATE_PROTOCOL'}
              onPress={handleLogin}
              loading={isLoading}
              variant="primary"
              size="lg"
              style={styles.loginButton}
              icon={<MaterialIcons name="arrow-forward" size={20} color={colors.backgroundDark} />}
            />

            {/* Toggle Register/Login */}
            <TouchableOpacity 
              style={styles.toggleContainer}
              onPress={() => {
                setIsRegistering(!isRegistering);
                setLocalError(null);
                clearError();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleText}>
                {isRegistering 
                  ? 'EXISTING_OPERATOR? INITIALIZE_LOGIN' 
                  : 'NEW_OPERATOR? REQUEST_ACCESS (CONSULTA)'}
              </Text>
            </TouchableOpacity>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // surface-charcoal equivalent
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
    opacity: 0.8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    marginBottom: 8,
  },
  title: {
    fontWeight: '800',
    fontSize: 32,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 1,
  },
  loginButton: {
    width: '100%',
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 8,
  },
  toggleText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.primaryMuted,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
