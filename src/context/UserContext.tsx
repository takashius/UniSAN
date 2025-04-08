import React, { createContext, useContext, useState, ReactNode } from 'react';
import SecureStoreManager from '../components/AsyncStorageManager';

type User = {
  email: string;
  name: string;
  lastName?: string;
  photo?: string;
  token: string;
};

type UserContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userData: User) => {
    await SecureStoreManager.setItem<string>("Token", userData.token);
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    await SecureStoreManager.removeItem("Token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
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