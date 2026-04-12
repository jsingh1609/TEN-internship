import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('vibegram_user');
    const storedTokens = localStorage.getItem('vibegram_tokens');
    
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      api.getMe()
        .then(userData => {
          setUser(userData);
          localStorage.setItem('vibegram_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('vibegram_user');
          localStorage.removeItem('vibegram_tokens');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await api.login({ username, password });
    localStorage.setItem('vibegram_tokens', JSON.stringify(data.tokens));
    localStorage.setItem('vibegram_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('vibegram_tokens', JSON.stringify(data.tokens));
    localStorage.setItem('vibegram_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vibegram_tokens');
    localStorage.removeItem('vibegram_user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('vibegram_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
