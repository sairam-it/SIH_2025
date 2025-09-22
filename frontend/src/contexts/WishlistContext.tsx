import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Destination, WishlistItem } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (destination: Destination) => Promise<boolean>;
  removeFromWishlist: (destinationId: string) => Promise<void>;
  isInWishlist: (destinationId: string) => boolean;
  clearWishlist: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

interface WishlistProviderProps {
  children: ReactNode;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children, showNotification }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await axios.get('/wishlist');
      const backendWishlist = response.data.data;
      
      // Convert backend format to frontend format
      const formattedWishlist: WishlistItem[] = backendWishlist.map((destination: any) => ({
        id: `${user.id}_${destination._id}`,
        destination: {
          id: destination._id,
          name: destination.name,
          state: destination.state,
          description: destination.description,
          category: destination.category,
          image: destination.images?.[0]?.url || '',
          images: destination.images || [],
          highlights: destination.highlights || [],
          bestTime: destination.bestTime,
          duration: destination.duration
        },
        addedAt: new Date(),
        userId: user.id
      }));

      setWishlistItems(formattedWishlist);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      const message = error.response?.data?.message || 'Failed to fetch wishlist';
      showNotification(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (destination: Destination): Promise<boolean> => {
    if (!user || !token) {
      showNotification('Please sign in to add destinations to your wishlist', 'error');
      return false;
    }

    const isAlreadyInWishlist = wishlistItems.some(item => item.destination.id === destination.id);
    
    if (isAlreadyInWishlist) {
      showNotification(`${destination.name} is already in your Wishlist.`, 'error');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`/wishlist/${destination.id}`);
      
      // Add to local state
      const newWishlistItem: WishlistItem = {
        id: `${user.id}_${destination.id}`,
        destination,
        addedAt: new Date(),
        userId: user.id
      };

      setWishlistItems(prev => [...prev, newWishlistItem]);
      
      showNotification(response.data.message || `${destination.name} has been added to your Wishlist!`, 'success');
      return true;
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      showNotification(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (destinationId: string): Promise<void> => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      await axios.delete(`/wishlist/${destinationId}`);
      
      // Remove from local state
      setWishlistItems(prev => prev.filter(item => item.destination.id !== destinationId));
      
      showNotification('Destination removed from wishlist', 'success');
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      showNotification(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (destinationId: string): boolean => {
    return wishlistItems.some(item => item.destination.id === destinationId);
  };

  const clearWishlist = async (): Promise<void> => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      await axios.delete('/wishlist');
      setWishlistItems([]);
      showNotification('Wishlist cleared successfully', 'success');
    } catch (error: any) {
      console.error('Error clearing wishlist:', error);
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      showNotification(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};