import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('smartCampusUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('smartCampusToken');
    setAuthToken(token);
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user: userData } = response.data;
    localStorage.setItem('smartCampusToken', token);
    localStorage.setItem('smartCampusUser', JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('smartCampusToken');
    localStorage.removeItem('smartCampusUser');
    setAuthToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
