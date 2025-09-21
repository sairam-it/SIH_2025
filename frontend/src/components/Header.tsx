import React, { useState } from 'react';
import { Menu, X, MapPin, Phone, Mail, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onSignInClick: () => void;
  onLogoClick: () => void;
  onWishlistClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick, onLogoClick, onWishlistClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-orange-600" />
              <span>+91-1234-567-890</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-orange-600" />
              <span>info@incredibleindia.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>Explore India</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo - Now clickable */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onLogoClick}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Incredible India</h1>
              <p className="text-sm text-gray-600">Discover the Land of Wonders</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#destinations" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Destinations
            </a>
            <a href="#hotels" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Stay
            </a>
            <a href="#culture" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Culture
            </a>
            <button
              onClick={onWishlistClick}
              className="text-gray-700 hover:text-red-500 transition-colors font-medium flex items-center space-x-1"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={onSignInClick}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#destinations" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Destinations
              </a>
              <a href="#hotels" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Stay
              </a>
              <a href="#culture" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Culture
              </a>
              <button
                onClick={onWishlistClick}
                className="text-gray-700 hover:text-red-500 transition-colors font-medium flex items-center space-x-2 text-left"
              >
                <Heart className="w-5 h-5" />
                <span>My Wishlist</span>
              </button>
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">{user.name}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full text-red-600 hover:text-red-700 transition-colors py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onSignInClick}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all w-full"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;