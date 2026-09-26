import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (loginId: string, password: string) => Promise<boolean>;
  signup: (loginId: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (loginId: string, password: string) => {
    // Mock login logic
    if (password === 'Test@123') {
      setCurrentUser({
        id: '1',
        loginId,
        email: `${loginId}@example.com`,
        name: loginId,
        role: 'Admin'
      });
      return true;
    }
    return false;
  };

  const signup = async (loginId: string, email: string, password: string) => {
    // Mock signup logic
    if (loginId.length >= 6 && loginId.length <= 12 && password.length >= 8) {
      // Note: Full regex checks can be added here
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const forgotPassword = async (email: string) => {
    // Mock forgot password
    return true;
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    // Mock reset password
    if (otp === '123456') {
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, user: currentUser, isAuthenticated: !!currentUser, login, signup, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
