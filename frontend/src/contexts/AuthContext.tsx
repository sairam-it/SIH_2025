import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      showNotification('Logged in successfully!');

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      showNotification('Login failed. Please check your credentials.', 'error');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password, phone });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      showNotification('Account created successfully!');

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      showNotification('Signup failed. Please try again.', 'error');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
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

