export interface Destination {
  id: string;
  name: string;
  state: string;
  description: string;
  image: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  category: 'heritage' | 'nature' | 'adventure' | 'spiritual' | 'modern';
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  duration: string;
  price: string;
  category: 'culture' | 'adventure' | 'food' | 'wellness' | 'wildlife';
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: string;
  image: string;
  amenities: string[];
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  duration: number;
  budget?: string;
  tripType: 'cultural' | 'adventure' | 'spiritual' | 'nature' | 'food';
  safetyMonitoring: boolean;
  travelers: number;
  userId: string;
  createdAt: Date;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals: string[];
}

export interface WishlistItem {
  id: string;
  destination: Destination;
  addedAt: Date;
  userId: string;
}