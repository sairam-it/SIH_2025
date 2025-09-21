import React, { useState } from 'react';
import { destinations } from '../data/destinations';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { Destination } from '../types';

interface DestinationsProps {
  onExploreDestination: (destination: Destination) => void;
  onViewAllDestinations: () => void;
}

const Destinations: React.FC<DestinationsProps> = ({ onExploreDestination, onViewAllDestinations }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All Destinations', count: destinations.length },
    { id: 'heritage', name: 'Heritage', count: destinations.filter(d => d.category === 'heritage').length },
    { id: 'nature', name: 'Nature', count: destinations.filter(d => d.category === 'nature').length },
    { id: 'adventure', name: 'Adventure', count: destinations.filter(d => d.category === 'adventure').length },
    { id: 'spiritual', name: 'Spiritual', count: destinations.filter(d => d.category === 'spiritual').length },
  ];

  const filteredDestinations = activeCategory === 'all' 
    ? destinations.slice(0, 6) // Show only first 6 destinations initially
    : destinations.filter(dest => dest.category === activeCategory).slice(0, 6);

  return (
    <section id="destinations" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Discover Amazing
            <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Destinations
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From ancient monuments to natural wonders, explore India's most captivating destinations 
            that offer unforgettable experiences for every traveler.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <div 
              key={destination.id} 
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {destination.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-800">{destination.name}</h3>
                  <div className="flex items-center text-orange-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{destination.state}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{destination.bestTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{destination.duration}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.slice(0, 3).map((highlight, index) => (
                      <span 
                        key={index}
                        className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => onExploreDestination(destination)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Explore Destination
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button 
            onClick={onViewAllDestinations}
            className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  );
};

export default Destinations;