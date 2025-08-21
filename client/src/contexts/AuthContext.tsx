import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, AuthUser } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial user state
    const currentUser = auth.getUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for auth changes
    const unsubscribe = auth.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await auth.signIn(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (userData: any) => {
    setLoading(true);
    try {
      await auth.signUp(userData);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Also update the user in localStorage to persist changes
      auth.updateUserInStorage(updatedUser);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
