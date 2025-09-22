import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const destinationsAPI = {
  getAll: (params?: any) => api.get('/destinations', { params }),
  getById: (id: string) => api.get(`/destinations/${id}`),
  getByCategory: (category: string, params?: any) => api.get(`/destinations/category/${category}`, { params }),
  getPopular: (params?: any) => api.get('/destinations/popular', { params }),
  getByState: (state: string, params?: any) => api.get(`/destinations/state/${state}`, { params }),
};

export const hotelsAPI = {
  getAll: (params?: any) => api.get('/hotels', { params }),
  getById: (id: string) => api.get(`/hotels/${id}`),
  book: (id: string, bookingData: any) => api.post(`/hotels/${id}/book`, bookingData),
  getBookings: (params?: any) => api.get('/hotels/bookings/my', { params }),
  cancelBooking: (id: string, reason?: string) => api.put(`/hotels/bookings/${id}/cancel`, { cancellationReason: reason }),
  getByLocation: (state: string, city?: string, params?: any) => 
    api.get(`/hotels/location/${state}${city ? `/${city}` : ''}`, { params }),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (destinationId: string) => api.post(`/wishlist/${destinationId}`),
  remove: (destinationId: string) => api.delete(`/wishlist/${destinationId}`),
  clear: () => api.delete('/wishlist'),
  check: (destinationId: string) => api.get(`/wishlist/check/${destinationId}`),
};

export const searchAPI = {
  search: (params: any) => api.get('/search', { params }),
  suggestions: (params: any) => api.get('/search/suggestions', { params }),
  popular: () => api.get('/search/popular'),
};

export const uploadAPI = {
  uploadImage: (formData: FormData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadImages: (formData: FormData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFile: (filename: string) => api.delete(`/upload/${filename}`),
};

export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
  changePassword: (passwordData: any) => api.put('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

export default api;