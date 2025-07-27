import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/adminApi';
import { jwtDecode } from "jwt-decode";



const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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

  const login = async (email, password, role) => {
    try {
      const response = await authApi.login(email, password, role);
      
      // Store token
      localStorage.setItem('authToken', response.token);
      const decoded = jwtDecode(response.token);
      
      const userData = {
        id: decoded.id, 
        email: decoded.email,
        username: decoded.username, 
        role: decoded.role,
        hospitalId: decoded.hospitalId || null,
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username, email, password, role, hospitalId) => {
    try {
      await authApi.signup(username, email, password, role, hospitalId);
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