import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, Info, Mail, Sun, Moon, BarChart3, Trophy, BookOpen, Brain } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="transition-colors duration-300 bg-white border-b border-gray-200 dark:bg-dark-900 dark:border-dark-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-900 transition-colors dark:text-white hover:text-primary-600 dark:hover:text-primary-400 focus:text-primary-600 dark:focus:text-primary-400"
          >
            <Zap className="w-8 h-8 text-accent-500" />
            <span className="text-xl font-bold">NihongoFlash</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/learn"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/learn')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
                aria-current={isActive('/learn') ? 'page' : undefined}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn</span>
              </Link>

              <Link
                to="/quiz"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/quiz')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
                aria-current={isActive('/quiz') ? 'page' : undefined}
              >
                <Brain className="w-4 h-4" />
                <span>Quiz</span>
              </Link>
              
              <Link
                to="/statistics"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/statistics')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
                aria-current={isActive('/statistics') ? 'page' : undefined}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Stats</span>
              </Link>

              <Link
                to="/achievements"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/achievements')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
                aria-current={isActive('/achievements') ? 'page' : undefined}
              >
                <Trophy className="w-4 h-4" />
                <span>Awards</span>
              </Link>
              
              <Link
                to="/about"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
                aria-current={isActive('/about') ? 'page' : undefined}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
              
              <Link
                to="/contact"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/contact')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
                }`}
                aria-current={isActive('/contact') ? 'page' : undefined}
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 transition-colors bg-gray-100 rounded-lg dark:bg-dark-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

