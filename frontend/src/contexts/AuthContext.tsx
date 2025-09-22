import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  wishlist: string[];
  bookings: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name: string; phone?: string }) => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children, showNotification }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      showNotification(response.data.message || 'Logged in successfully!');
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showNotification(message, 'error');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/register', { name, email, password, phone });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      showNotification(response.data.message || 'Account created successfully!');
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Signup failed:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      showNotification(message, 'error');
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (data: { name: string; phone?: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.put('/auth/profile', data);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      showNotification(response.data.message || 'Profile updated successfully!');
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      const message = error.response?.data?.message || 'Profile update failed. Please try again.';
      showNotification(message, 'error');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove axios default authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    showNotification('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      login, 
      signup, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};