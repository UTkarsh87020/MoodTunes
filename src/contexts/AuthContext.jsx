import React, { createContext, useContext, useState } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const register = async (data) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUser({ ...mockUser, name: data.name, email: data.email, username: data.username });
    setIsLoading(false);
    return true;
  };

  const logout = () => setUser(null);

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
