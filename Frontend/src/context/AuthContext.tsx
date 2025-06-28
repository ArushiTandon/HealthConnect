import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/adminApi';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'hospital';
  hospitalId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: string, hospitalId?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: string) => {
    try {
      const response = await authApi.login(email, password, role);
      
      // Store token
      localStorage.setItem('authToken', response.token);
      console.log(response.data);
      
      // Create user object (you might want to get this from a separate API call)
      const userData: User = {
        id: response.data.id, 
        email,
        username: email.split('@')[0], // Temporary username
        role: role as 'user' | 'hospital',
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string, role: string, hospitalId?: string) => {
    try {
      await authApi.signup(username, email, password, role, hospitalId);
      // After successful signup, you might want to automatically log the user in
      // or redirect them to the login page
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
