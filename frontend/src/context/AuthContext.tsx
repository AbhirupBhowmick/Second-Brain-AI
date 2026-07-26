import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isGuest: boolean;
  login: (token: string, userData?: Partial<UserProfile>) => void;
  loginAsGuest: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEFAULT_GUEST_USER: UserProfile = {
  name: 'Guest User',
  email: 'guest@secondbrain.ai',
  role: 'Demo User',
  avatar: 'GU',
  isGuest: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isGuest, setIsGuest] = useState<boolean>(() => localStorage.getItem('is_guest') === 'true');
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user_profile');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // fallback
      }
    }
    if (localStorage.getItem('is_guest') === 'true') {
      return DEFAULT_GUEST_USER;
    }
    return null;
  });

  const login = (newToken: string, userData?: Partial<UserProfile>) => {
    localStorage.setItem('token', newToken);
    localStorage.removeItem('is_guest');
    const profile: UserProfile = {
      name: userData?.name || 'Authorized User',
      email: userData?.email || 'user@secondbrain.ai',
      role: userData?.role || 'Member',
      isGuest: false,
    };
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setToken(newToken);
    setIsGuest(false);
    setUser(profile);
  };

  const loginAsGuest = () => {
    const demoToken = 'demo_guest_token_' + Date.now();
    localStorage.setItem('token', demoToken);
    localStorage.setItem('is_guest', 'true');
    localStorage.setItem('user_profile', JSON.stringify(DEFAULT_GUEST_USER));
    setToken(demoToken);
    setIsGuest(true);
    setUser(DEFAULT_GUEST_USER);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_guest');
    localStorage.removeItem('user_profile');
    setToken(null);
    setIsGuest(false);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isGuest, login, loginAsGuest, logout, isAuthenticated }}>
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

