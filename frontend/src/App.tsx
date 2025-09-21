import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import Hotels from './components/Hotels';
import Culture from './components/Culture';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import TripPlanModal from './components/TripPlanModal';
import ItineraryPreview from './components/ItineraryPreview';
import DestinationDetail from './components/DestinationDetail';
import AllDestinations from './components/AllDestinations';
import CulturalDestinationDetail from './components/CulturalDestinationDetail';
import Wishlist from './components/Wishlist';
import Notification from './components/notification';
import { Destination, TripPlan } from './types';
import { CulturalDestination } from './types/Cultural';

// This is a sub-component that has access to the AuthContext
function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTripPlanModalOpen, setIsTripPlanModalOpen] = useState(false);
  const [isItineraryPreviewOpen, setIsItineraryPreviewOpen] = useState(false);
  const [isDestinationDetailOpen, setIsDestinationDetailOpen] = useState(false);
  const [isAllDestinationsOpen, setIsAllDestinationsOpen] = useState(false);
  const [isCulturalDetailOpen, setIsCulturalDetailOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedCulturalDestination, setSelectedCulturalDestination] = useState<CulturalDestination | null>(null);
  const [currentTripPlan, setCurrentTripPlan] = useState<TripPlan | null>(null);
  const { user } = useAuth();

  const handleStartJourney = () => {
    if (user) {
      setIsTripPlanModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  
  const handleSignInClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleTripPlanSubmit = (tripPlanData: Omit<TripPlan, 'id' | 'userId' | 'createdAt'>) => {
    const tripPlan: TripPlan = {
      ...tripPlanData,
      id: Date.now().toString(),
      userId: user?.id || '',
      createdAt: new Date()
    };
    setCurrentTripPlan(tripPlan);
    setIsTripPlanModalOpen(false);
    setIsItineraryPreviewOpen(true);
  };

  const handleExploreDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsDestinationDetailOpen(true);
  };

  const handleViewAllDestinations = () => {
    setIsAllDestinationsOpen(true);
  };

  const handleExploreCulturalDestination = (destination: CulturalDestination) => {
    setSelectedCulturalDestination(destination);
    setIsCulturalDetailOpen(true);
  };

  const handleLogoClick = () => {
    // Scroll to top of the page (home)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Close any open modals
    setIsDestinationDetailOpen(false);
    setIsAllDestinationsOpen(false);
    setIsCulturalDetailOpen(false);
    setIsItineraryPreviewOpen(false);
    setIsTripPlanModalOpen(false);
    setIsWishlistOpen(false);
  };

  const handleWishlistPlanTrip = () => {
    setIsWishlistOpen(false);
    if (user) {
      setIsTripPlanModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        onSignInClick={handleSignInClick} 
        onLogoClick={handleLogoClick}
        onWishlistClick={handleWishlistClick}
      />
      <Hero onStartJourney={handleStartJourney} />
      <Destinations onExploreDestination={handleExploreDestination} onViewAllDestinations={handleViewAllDestinations} />
      <Hotels />
      <Culture onExploreCulturalDestination={handleExploreCulturalDestination} />
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      
      <TripPlanModal 
        isOpen={isTripPlanModalOpen}
        onClose={() => setIsTripPlanModalOpen(false)}
        onSubmit={handleTripPlanSubmit}
      />
      
      {currentTripPlan && (
        <ItineraryPreview 
          isOpen={isItineraryPreviewOpen}
          onClose={() => setIsItineraryPreviewOpen(false)}
          tripPlan={currentTripPlan}
        />
      )}
      
      <DestinationDetail 
        isOpen={isDestinationDetailOpen}
        onClose={() => setIsDestinationDetailOpen(false)}
        destination={selectedDestination}
      />

      <AllDestinations 
        isOpen={isAllDestinationsOpen}
        onClose={() => setIsAllDestinationsOpen(false)}
        onExploreDestination={handleExploreDestination}
      />

      <CulturalDestinationDetail 
        isOpen={isCulturalDetailOpen}
        onClose={() => setIsCulturalDetailOpen(false)}
        destination={selectedCulturalDestination}
      />

      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onExploreDestination={handleExploreDestination}
        onPlanTrip={handleWishlistPlanTrip}
      />
    </div>
  );
}

// This is the main App component that wraps everything
function App() {
  // State to manage the notification's visibility and content
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Function to show the notification. This gets passed down to AuthProvider.
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };
  
  return (
    // The AuthProvider wraps the app and receives the showNotification function
    <AuthProvider showNotification={showNotification}> 
      <WishlistProvider showNotification={showNotification}>
        <AppContent />
        
        {/* Conditionally render the Notification component when there's a message */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;