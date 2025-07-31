import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'isAdmin'>) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
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
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('sarvi_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('sarvi_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Validate input
      if (!email && !password) {
        toast.error('Please enter both email and password', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      if (!email) {
        toast.error('Please enter your email address', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      if (!password) {
        toast.error('Please enter your password', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      const result = await userAPI.login(email, password);
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
        });
        toast.success(`Welcome back to Sarvi, ${result.user.firstName}!`, {
          duration: 5000,
          position: 'top-center',
        });
        return true;
      } else {
        // Handle specific error cases
        if (result.error === 'USER_NOT_FOUND') {
          toast.error('Email not registered. Please register first to continue.', {
            duration: 30000,
            position: 'top-center',
          });
        } else if (result.error === 'INVALID_PASSWORD') {
          toast.error('Password incorrect. Please try again.', {
            duration: 30000,
            position: 'top-center',
          });
        } else if (result.error === 'INVALID_CREDENTIALS') {
          toast.error('Invalid email or password. Please register if you don\'t have an account.', {
            duration: 30000,
            position: 'top-center',
          });
        } else {
          toast.error(result.error || 'Login failed. Please try again.', {
            duration: 30000,
            position: 'top-center',
          });
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your connection and try again.', {
        duration: 30000,
        position: 'top-center',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin'>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Validate required fields
      const requiredFields = ['email', 'firstName', 'lastName', 'phone', 'address', 'city', 'zipCode', 'password'];
      const missingFields = requiredFields.filter(field => !userData[field as keyof typeof userData]);
      
      if (missingFields.length > 0) {
        toast.error('All fields are required for registration', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        toast.error('Please enter a valid email address', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      // Validate phone number
      const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(userData.phone)) {
        toast.error('Please enter a valid phone number', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      // Validate password length
      if (userData.password.length < 6) {
        toast.error('Password must be at least 6 characters long', {
          duration: 30000,
          position: 'top-center',
        });
        return false;
      }

      const result = await userAPI.register(userData);
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
        });
        toast.success(`Successfully registered! Welcome to Sarvi, ${result.user.firstName}!`, {
          duration: 5000,
          position: 'top-center',
        });
        return true;
      } else {
        if (result.error === 'USER_EXISTS') {
          toast.error('Email already registered. Please login with your existing account.', {
            duration: 30000,
            position: 'top-center',
          });
        } else {
          toast.error(result.error || 'Registration failed. Please try again.', {
            duration: 30000,
            position: 'top-center',
          });
        }
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please check your connection and try again.', {
        duration: 30000,
        position: 'top-center',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await userAPI.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
      toast.success('Logged out successfully', {
        duration: 3000,
        position: 'top-center',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};