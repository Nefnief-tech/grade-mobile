import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AppwriteService from '../appwrite/service';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  $id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      
      // First check if we have cached user data
      const cachedUser = await AsyncStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }

      // Then verify with Appwrite
      const currentUser = await AppwriteService.getCurrentUser();
      if (currentUser) {
        const userData = {
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await AppwriteService.loginWithEmail(email, password);
      
      const currentUser = await AppwriteService.getCurrentUser();
      if (currentUser) {
        const userData = {
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await AppwriteService.registerWithEmail(email, password, name);
      
      const currentUser = await AppwriteService.getCurrentUser();
      if (currentUser) {
        const userData = {
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AppwriteService.logout();
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      await AsyncStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
