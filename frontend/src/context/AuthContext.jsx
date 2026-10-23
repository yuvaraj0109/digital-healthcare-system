import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dhp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dhp_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authAPI
        .getProfile()
        .then((res) => {
          const profile = res.data;
          const updatedUser = { ...user, ...profile };
          setUser(updatedUser);
          localStorage.setItem('dhp_user', JSON.stringify(updatedUser));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password, role) => {
    try {
      const res = await authAPI.login({ email, password, role });
      const userData = res.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('dhp_token', userData.token);
      localStorage.setItem('dhp_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Check credentials.';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (patientData) => {
    try {
      const res = await authAPI.register(patientData);
      toast.success('Registration successful! Welcome to AuraHealth.');
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dhp_token');
    localStorage.removeItem('dhp_user');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isPatient: user?.role === 'Patient',
        isAdmin: user?.role === 'Admin',
        isStaff: user?.role === 'Staff',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
