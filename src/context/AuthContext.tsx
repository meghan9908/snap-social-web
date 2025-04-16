
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  postsCount: number;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: "user1",
  username: "johndoe",
  name: "John Doe",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format",
  bio: "Photography enthusiast | Travel lover",
  followers: 429,
  following: 298,
  postsCount: 15,
};

// Use localStorage to persist auth state
const AUTH_STORAGE_KEY = "instagram_clone_auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage if available
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  const initialAuth = storedAuth ? JSON.parse(storedAuth) : false;
  
  const [currentUser, setCurrentUser] = useState<User | null>(initialAuth ? mockUser : null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth);

  // Update localStorage when auth state changes
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const login = () => {
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    return isAuthenticated;
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, checkAuth }}>
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
