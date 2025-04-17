
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

// Function to generate a random username
const generateRandomUsername = (): string => {
  const adjectives = ['Happy', 'Sunny', 'Clever', 'Bright', 'Swift', 'Cool', 'Funny', 'Witty', 'Smart'];
  const nouns = ['Cat', 'Dog', 'Fox', 'Bear', 'Tiger', 'Lion', 'Eagle', 'Wolf', 'Panda'];
  const randomNum = Math.floor(Math.random() * 1000);
  
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdj}${randomNoun}${randomNum}`;
};

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
  updateUsername: (newUsername: string) => Promise<{success: boolean, message: string}>;
  isUsernameAvailable: (username: string) => Promise<boolean>;
  usernames: string[];  // Store existing usernames
}

const ClerkUserContext = createContext<ClerkUserContextType>({
  currentUser: null,
  isAuthenticated: false,
  updateUsername: async () => ({success: false, message: 'Context not initialized'}),
  isUsernameAvailable: async () => false,
  usernames: []
});

export const ClerkUserProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, user } = useUser();
  const [usernames, setUsernames] = useState<string[]>([
    'jane_smith', 'travel_guy', 'photography', 'food_lover', 'fashion_blog'
  ]); // Example usernames
  const [randomUsername, setRandomUsername] = useState<string>('');
  
  // Generate random username on initial load if user doesn't have one
  useEffect(() => {
    if (isSignedIn && user && !user.username) {
      const newRandomUsername = generateRandomUsername();
      setRandomUsername(newRandomUsername);
      // In a real app, this would update the username in Clerk's backend
      console.log('Generated random username:', newRandomUsername);
    }
  }, [isSignedIn, user]);

  const currentUser = isSignedIn && user ? {
    id: user.id,
    username: user.username || randomUsername || generateRandomUsername(),
    name: user.fullName || 'User',
    avatar: user.imageUrl,
    bio: '',
    followers: 0,
    following: 0,
    postsCount: 0
  } : null;

  const isUsernameAvailable = async (username: string): Promise<boolean> => {
    // In a real app, this would check against a database
    return !usernames.includes(username);
  };

  const updateUsername = async (newUsername: string): Promise<{success: boolean, message: string}> => {
    if (!newUsername || newUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' };
    }
    
    const available = await isUsernameAvailable(newUsername);
    if (!available) {
      return { success: false, message: 'Username is already taken' };
    }

    if (user) {
      try {
        // In a real app with Clerk, you would update the username like this:
        // await user.update({ username: newUsername });
        
        // For now, we'll just add it to our local list and update randomly generated
        setUsernames([...usernames, newUsername]);
        setRandomUsername(newUsername);
        return { success: true, message: 'Username updated successfully' };
      } catch (error) {
        return { success: false, message: 'Failed to update username' };
      }
    }
    
    return { success: false, message: 'User not authenticated' };
  };

  return (
    <ClerkUserContext.Provider value={{ 
      currentUser, 
      isAuthenticated: isSignedIn,
      updateUsername,
      isUsernameAvailable,
      usernames
    }}>
      {children}
    </ClerkUserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(ClerkUserContext);
};
