import React, { createContext, useContext, useState, ReactNode } from 'react';
import SecureStoreManager from '../components/AsyncStorageManager';
import { Account } from '../types';

type UserContextType = {
  user: Account | null;
  login: (userData: Account) => void;
  logout: () => void;
  setUser: any;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Account | null>(null);

  const login = async (userData: Account) => {
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    await SecureStoreManager.removeItem("Token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};