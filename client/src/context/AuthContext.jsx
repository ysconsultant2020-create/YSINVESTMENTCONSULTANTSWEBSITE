import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ys_user');
    const token = localStorage.getItem('ys_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('ys_token', data.token);
    localStorage.setItem('ys_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('ys_token', data.token);
    localStorage.setItem('ys_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('ys_token');
    localStorage.removeItem('ys_user');
    setUser(null);
  };

  const isManager = user?.role === 'manager';
  const isClient = user?.role === 'client';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      isManager, isClient, isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
