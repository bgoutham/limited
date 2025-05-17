import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = 'limited_token';
const USER_KEY = 'limited_user';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      
      // Set auth header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post(`${API}/auth/register`, userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    }
  };

  // Login
  const login = async (email, password) => {
    setError(null);
    try {
      // FastAPI expects OAuth2 form data format for login
      const formData = new FormData();
      formData.append('username', email); // FastAPI uses 'username' for the email field
      formData.append('password', password);
      
      const response = await axios.post(`${API}/auth/token`, formData);
      
      const { access_token, user } = response.data;
      
      // Save auth data to state and localStorage
      setToken(access_token);
      setCurrentUser(user);
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Set auth header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return user;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  };

  // Logout
  const logout = () => {
    // Clear auth data
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid, log the user out
        logout();
      }
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      const response = await axios.put(`${API}/auth/me`, userData);
      
      // Update the stored user data
      setCurrentUser(prev => ({
        ...prev,
        ...response.data
      }));
      localStorage.setItem(USER_KEY, JSON.stringify({
        ...currentUser,
        ...response.data
      }));
      
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    isAuthenticated: !!token,
    isVerified: currentUser?.is_verified,
    userType: currentUser?.user_type,
    loading,
    error,
    register,
    login,
    logout,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;