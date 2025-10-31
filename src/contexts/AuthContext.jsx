import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getCurrentUser, isAuthenticated } from '../services/api';

/**
 * Authentication context for managing user state across the application
 */
const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
            
            // Refresh user data from API
            try {
              const freshUserData = await authApi.getProfile();
              setUser(freshUserData);
            } catch (error) {
              // If token is invalid, clear auth but don't trigger logout to avoid loops
              console.warn('Token invalid, clearing auth');
              localStorage.removeItem('ecotrade_token');
              localStorage.removeItem('ecotrade_user');
              setUser(null);
              setIsLoggedIn(false);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('ecotrade_user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
