import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, Info, Mail } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-primary-400 focus:text-primary-400 transition-colors"
          >
            <Zap className="h-8 w-8 text-accent-500" />
            <span className="text-xl font-bold">NihongoFlash</span>
          </Link>
          
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-400 bg-dark-800' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/about"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-primary-400 bg-dark-800' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
              aria-current={isActive('/about') ? 'page' : undefined}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
            
            <Link
              to="/contact"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-primary-400 bg-dark-800' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;