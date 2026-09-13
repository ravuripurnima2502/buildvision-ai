import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../types/project';
import { loadStoredUser, saveStoredUser } from '../../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  register: (email: string, name: string, company?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = loadStoredUser();
    if (saved) {
      setUser(saved);
    }
  }, []);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name: name || email.split('@')[0].toUpperCase(),
      company: 'Premier Architectural Studio',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    saveStoredUser(newUser);
  };

  const register = (email: string, name: string, company?: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name,
      company: company || 'Architectural Planning Partner',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    saveStoredUser(newUser);
  };

  const logout = () => {
    setUser(null);
    saveStoredUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
