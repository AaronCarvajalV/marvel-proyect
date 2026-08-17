import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '../types';
import { authApi } from '../api';
import { registerUnauthorizedListener } from '../api/client';
import { getStoredToken, setStoredToken, removeStoredToken } from '../storage/asyncStorage';
import { initializeApiBaseUrl } from '../config/env';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearSession = useCallback(async () => {
    setUser(null);
    setToken(null);
    await removeStoredToken();
  }, []);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await initializeApiBaseUrl();
      const storedToken = await getStoredToken();
      if (storedToken) {
        setToken(storedToken);
        // Verify with live backend /api/auth/me
        const profile = await authApi.getMe();
        setUser(profile);
      } else {
        await clearSession();
      }
    } catch (err: unknown) {
      console.warn('Session restore failed or expired:', err);
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Subscribe to automatic 401 global logout
  useEffect(() => {
    const unsubscribe = registerUnauthorizedListener(() => {
      clearSession();
    });
    return unsubscribe;
  }, [clearSession]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.login({ email: email.trim(), password });
      await setStoredToken(data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return true;
    } catch (err: unknown) {
      let errorMessage = 'Error al iniciar sesión. Verifique su conexión y credenciales.';
      if (err && typeof err === 'object' && 'response' in err) {
        const responseData = (err as { response?: { data?: { message?: string } } }).response?.data;
        if (responseData?.message) {
          errorMessage = responseData.message;
        }
      }
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Continue cleanup regardless
    } finally {
      await clearSession();
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch {
      // Ignore
    }
  };

  const registerUser = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      setToken(response.access_token);
      setUser(response.user);
      await setStoredToken(response.access_token);
      return true;
    } catch (err: any) {
      console.error('Register failed:', err);
      const msg = err.response?.data?.message || err.message || 'Error en el registro';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      error,
      login,
      register: registerUser,
      logout,
      clearError,
      refreshUser,
    }),
    [user, token, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
