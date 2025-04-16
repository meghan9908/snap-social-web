
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
  loginWithGoogle: () => void;
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

const mockGoogleUser: User = {
  id: "user2",
  username: "googleuser",
  name: "Google User",
  avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format",
  bio: "Signed in with Google | Tech enthusiast",
  followers: 215,
  following: 176,
  postsCount: 8,
};

// Use localStorage to persist auth state
const AUTH_STORAGE_KEY = "instagram_clone_auth";
const AUTH_METHOD_KEY = "instagram_clone_auth_method";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Force clear any existing auth state when the app loads
  useEffect(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_METHOD_KEY);
  }, []);
  
  // Always start with logged out state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Update localStorage when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_METHOD_KEY);
    }
  }, [isAuthenticated]);

  const login = () => {
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_METHOD_KEY, "regular");
  };

  const loginWithGoogle = () => {
    setCurrentUser(mockGoogleUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_METHOD_KEY, "google");
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_METHOD_KEY);
  };

  const checkAuth = () => {
    return isAuthenticated;
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, loginWithGoogle, logout, checkAuth }}>
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
