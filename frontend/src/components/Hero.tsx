import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartJourney }) => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg" 
          alt="Taj Mahal at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
            <span className="text-white text-sm font-medium">✨ Discover the Magic of India</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Incredible
            <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              India
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            Experience the land of diverse cultures, ancient heritage, and breathtaking landscapes. 
            From the majestic Himalayas to pristine beaches, embark on a journey like no other.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={onStartJourney}
              className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center hover:bg-white/20 transition-all">
              <Play className="w-5 h-5 mr-2" />
              Watch Video
            </button>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">29</div>
              <div className="text-gray-300 text-sm">States & UTs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">38</div>
              <div className="text-gray-300 text-sm">UNESCO Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-gray-300 text-sm">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-gray-300 text-sm">Years History</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;