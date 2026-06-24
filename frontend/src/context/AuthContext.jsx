import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getToken,
  setToken,
  getUserId,
  setUserId,
  clearAuth,
  getSelectedSymbol,
  setSelectedSymbol as persistSelectedSymbol,
} from '../utils/storage';
import { getUserIdFromToken } from '../utils/jwt';
import { setLogoutHandler } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [userId, setUserIdState] = useState(() => getUserId());
  const [selectedSymbol, setSelectedSymbolState] = useState(() => getSelectedSymbol());

  const isAuthenticated = Boolean(token && userId);

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUserIdState(null);
  }, []);

  useEffect(() => {
    setLogoutHandler(() => {
      logout();
      window.location.href = '/login';
    });
  }, [logout]);

  const login = useCallback((newToken) => {
    setToken(newToken);
    setTokenState(newToken);

    const id = getUserIdFromToken(newToken);
    if (id) {
      setUserId(id);
      setUserIdState(id);
    }
  }, []);

  const registerSession = useCallback((id, newToken = null) => {
    if (newToken) {
      setToken(newToken);
      setTokenState(newToken);
    }
    setUserId(id);
    setUserIdState(id);
  }, []);

  const selectSymbol = useCallback((symbol) => {
    const upper = symbol?.toUpperCase() || null;
    setSelectedSymbolState(upper);
    persistSelectedSymbol(upper);
  }, []);

  const value = {
    token,
    userId,
    isAuthenticated,
    selectedSymbol,
    login,
    registerSession,
    logout,
    selectSymbol,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
