import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Destination, WishlistItem } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (destination: Destination) => boolean;
  removeFromWishlist: (destinationId: string) => void;
  isInWishlist: (destinationId: string) => boolean;
  clearWishlist: () => void;
}

interface WishlistProviderProps {
  children: ReactNode;
  showNotification: (message: string, type?: 'success' | 'error') => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children, showNotification }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (storedWishlist) {
        try {
          const parsedWishlist = JSON.parse(storedWishlist);
          setWishlistItems(parsedWishlist);
        } catch (error) {
          console.error('Error parsing wishlist:', error);
        }
      }
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const saveToLocalStorage = (items: WishlistItem[]) => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(items));
    }
  };

  const addToWishlist = (destination: Destination): boolean => {
    if (!user) {
      showNotification('Please sign in to add destinations to your wishlist', 'error');
      return false;
    }

    const isAlreadyInWishlist = wishlistItems.some(item => item.destination.id === destination.id);
    
    if (isAlreadyInWishlist) {
      showNotification(`${destination.name} is already in your Wishlist.`, 'error');
      return false;
    }

    const newWishlistItem: WishlistItem = {
      id: Date.now().toString(),
      destination,
      addedAt: new Date(),
      userId: user.id
    };

    const updatedWishlist = [...wishlistItems, newWishlistItem];
    setWishlistItems(updatedWishlist);
    saveToLocalStorage(updatedWishlist);
    
    showNotification(`${destination.name} has been added to your Wishlist!`, 'success');
    return true;
  };

  const removeFromWishlist = (destinationId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.destination.id !== destinationId);
    setWishlistItems(updatedWishlist);
    saveToLocalStorage(updatedWishlist);
    showNotification('Destination removed from wishlist', 'success');
  };

  const isInWishlist = (destinationId: string): boolean => {
    return wishlistItems.some(item => item.destination.id === destinationId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    if (user) {
      localStorage.removeItem(`wishlist_${user.id}`);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
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