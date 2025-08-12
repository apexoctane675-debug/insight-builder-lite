import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { AuthService } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
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
    const user = AuthService.getCurrentUser();
    setAuthState({
      user,
      isAuthenticated: !!user,
    });
    setLoading(false);
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

  const logout = () => {
    AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    try {
      const updatedUser = AuthService.updateProfile(userData);
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
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