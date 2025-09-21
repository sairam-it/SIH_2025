import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Incredible India</h3>
                <p className="text-gray-400">Discover the Land of Wonders</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Experience the magic of India through our carefully curated destinations, 
              authentic experiences, and local connections that create memories to last a lifetime.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#destinations" className="text-gray-300 hover:text-orange-400 transition-colors">Destinations</a></li>
              <li><a href="#experiences" className="text-gray-300 hover:text-orange-400 transition-colors">Experiences</a></li>
              <li><a href="#hotels" className="text-gray-300 hover:text-orange-400 transition-colors">Hotels</a></li>
              <li><a href="#culture" className="text-gray-300 hover:text-orange-400 transition-colors">Culture</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Travel Tips</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">+91-1234-567-890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">info@incredibleindia.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-1" />
                <span className="text-gray-300">
                  Ministry of Tourism<br />
                  Government of India<br />
                  New Delhi, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-gray-300">Get the latest travel updates and exclusive offers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border border-gray-700"
              />
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Incredible India. All rights reserved. | Privacy Policy | Terms of Service
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;