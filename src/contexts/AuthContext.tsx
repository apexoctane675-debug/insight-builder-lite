import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { AuthService } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: !!user,
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const user = await AuthService.getCurrentUser();
          setAuthState({
            user,
            isAuthenticated: !!user,
          });
        } catch (error) {
          console.error('Error getting user after sign in:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          isAuthenticated: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await AuthService.login({ email, password });
      setAuthState({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const user = await AuthService.signup({ name, email, password, confirmPassword });
      setAuthState({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};