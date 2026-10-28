import React, { createContext, useState, useEffect } from 'react';
import { getProfile, loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('ds_token');
      if (token) {
        try {
          const res = await getProfile();
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('ds_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    if (res.data?.success) {
      localStorage.setItem('ds_token', res.data.token);
      setUser(res.data.data);
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await apiRegister({ name, email, password });
    if (res.data?.success) {
      localStorage.setItem('ds_token', res.data.token);
      setUser(res.data.data);
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('ds_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
