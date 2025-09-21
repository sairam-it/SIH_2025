import React from 'react';
import { X, MapPin, Clock, Star, Camera, Utensils, Bed } from 'lucide-react';
import { TripPlan, ItineraryItem } from '../types';

interface ItineraryPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
}

const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({ isOpen, onClose, tripPlan }) => {
  if (!isOpen) return null;

  // Mock itinerary data - replace with real API data
  const generateItinerary = (): ItineraryItem[] => {
    const baseItinerary: ItineraryItem[] = [
      {
        day: 1,
        title: 'Arrival & Local Exploration',
        description: 'Arrive at your destination and get acquainted with the local culture',
        activities: ['Airport pickup', 'Hotel check-in', 'Local market visit', 'Welcome dinner'],
        accommodation: 'Heritage Hotel',
        meals: ['Welcome dinner at local restaurant']
      },
      {
        day: 2,
        title: 'Cultural Immersion',
        description: 'Dive deep into the rich cultural heritage of the region',
        activities: ['Historical site visit', 'Local guide tour', 'Traditional craft workshop', 'Cultural performance'],
        accommodation: 'Heritage Hotel',
        meals: ['Breakfast', 'Traditional lunch', 'Dinner']
      }
    ];

    // Generate additional days based on duration
    for (let i = 3; i <= tripPlan.duration; i++) {
      if (i === tripPlan.duration) {
        baseItinerary.push({
          day: i,
          title: 'Departure',
          description: 'Final exploration and departure',
          activities: ['Last-minute shopping', 'Hotel checkout', 'Airport transfer'],
          accommodation: 'N/A',
          meals: ['Breakfast']
        });
      } else {
        baseItinerary.push({
          day: i,
          title: `Day ${i} Adventure`,
          description: 'Continue exploring the wonders of your destination',
          activities: ['Morning excursion', 'Lunch at scenic spot', 'Afternoon activities', 'Evening leisure'],
          accommodation: 'Heritage Hotel',
          meals: ['Breakfast', 'Lunch', 'Dinner']
        });
      }
    }

    return baseItinerary;
  };

  const itinerary = generateItinerary();

  const mockHotels = [
    {
      name: 'Royal Heritage Palace',
      rating: 5,
      price: '₹8,500/night',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
      amenities: ['Spa', 'Pool', 'Restaurant', 'WiFi']
    },
    {
      name: 'Boutique Garden Resort',
      rating: 4,
      price: '₹5,200/night',
      image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
      amenities: ['Garden View', 'Restaurant', 'WiFi', 'Parking']
    }
  ];

  const mockExperiences = [
    {
      title: 'Cooking Class with Local Family',
      price: '₹2,500',
      duration: '3 hours',
      image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg'
    },
    {
      title: 'Heritage Walk with Guide',
      price: '₹1,800',
      duration: '2 hours',
      image: 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Personalized Itinerary</h2>
              <p className="text-gray-600 mt-1">{tripPlan.destination} • {tripPlan.duration} days • {tripPlan.travelers} travelers</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Trip Overview */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white mb-8">
            <h3 className="text-xl font-bold mb-4">Trip Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm opacity-90">Destination</div>
                <div className="font-semibold">{tripPlan.destination}</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm opacity-90">Duration</div>
                <div className="font-semibold">{tripPlan.duration} Days</div>
              </div>
              <div className="text-center">
                <Star className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm opacity-90">Trip Type</div>
                <div className="font-semibold capitalize">{tripPlan.tripType}</div>
              </div>
              <div className="text-center">
                <Camera className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm opacity-90">Travelers</div>
                <div className="font-semibold">{tripPlan.travelers} People</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itinerary */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Day-by-Day Itinerary</h3>
              <div className="space-y-4">
                {itinerary.map((day) => (
                  <div key={day.day} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {day.day}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-gray-800">{day.title}</h4>
                        <p className="text-sm text-gray-600">{day.description}</p>
                      </div>
                    </div>
                    <div className="ml-11 space-y-2">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Activities:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {day.activities.map((activity, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{day.accommodation}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Utensils className="w-4 h-4 mr-1" />
                        <span>{day.meals.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="space-y-6">
                {/* Hotels */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Hotels</h3>
                  <div className="space-y-3">
                    {mockHotels.map((hotel, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-24 object-cover rounded mb-2" />
                        <h4 className="font-semibold text-sm">{hotel.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            {[...Array(hotel.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-orange-600">{hotel.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experiences */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Special Experiences</h3>
                  <div className="space-y-3">
                    {mockExperiences.map((exp, index) => (
                      <div key={index} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <img src={exp.image} alt={exp.title} className="w-full h-24 object-cover rounded mb-2" />
                        <h4 className="font-semibold text-sm">{exp.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">{exp.duration}</span>
                          <span className="text-sm font-semibold text-orange-600">{exp.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Tips */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🎭 Cultural Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Dress modestly when visiting temples</li>
                    <li>• Try local street food for authentic flavors</li>
                    <li>• Learn basic Hindi greetings</li>
                    <li>• Respect local customs and traditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              Save Itinerary
            </button>
            <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              Edit Trip
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPreview;