import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {generateUniqueId} from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Validate company email (should end with company domain)
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        throw new Error('Invalid email format');
      }

      // In production, this would make an API call to authenticate
      // For now, we'll simulate authentication
      const userData = {
        id: generateUniqueId(),
        email,
        name: email.split('@')[0],
        verified: true,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return {success: true, user: userData};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  const register = async (email, password, name) => {
    try {
      // Validate company email
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        throw new Error('Please use your company email');
      }

      // In production, send verification email
      const userData = {
        id: generateUniqueId(),
        email,
        name,
        verified: false,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return {success: true, user: userData};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const verifyEmail = async (code) => {
    try {
      // In production, verify with backend
      const updatedUser = {...user, verified: true};
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
