
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';

interface ClerkUserContextType {
  currentUser: {
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio?: string;
    followers: number;
    following: number;
    postsCount: number;
  } | null;
  isAuthenticated: boolean;
}

const ClerkUserContext = createContext<ClerkUserContextType>({
  currentUser: null,
  isAuthenticated: false
});

export const ClerkUserProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, user } = useUser();
  
  const currentUser = isSignedIn && user ? {
    id: user.id,
    username: user.username || user.firstName || 'user',
    name: user.fullName || 'User',
    avatar: user.imageUrl,
    bio: '',
    followers: 0,
    following: 0,
    postsCount: 0
  } : null;

  return (
    <ClerkUserContext.Provider value={{ 
      currentUser, 
      isAuthenticated: isSignedIn 
    }}>
      {children}
    </ClerkUserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(ClerkUserContext);
};
