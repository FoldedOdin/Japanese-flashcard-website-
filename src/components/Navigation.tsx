import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Brain, BarChart3, Trophy, Info, Mail, Sun, Moon, Menu, X, Settings, Home, LogIn, LogOut, Map, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';


const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/kana-city', label: 'Kana City', icon: Map },
  { to: '/ai-coach', label: 'AI Coach', icon: Sparkles },
  { to: '/statistics', label: 'Stats', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface NavigationProps {
  onMenuClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const resolvedTheme =
    theme === 'system'
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

  const isActive = (path: string) => location.pathname === path;

  // Filter links for the navbar - only show public links here if user is logged in
  // All other links move to the sidebar
  const filteredNavItems = navItems.filter((item) => {
    if (user) {
      // When logged in, only show basic info links in navbar, or nothing if they are all in sidebar
      return ['/about', '/contact'].includes(item.to);
    }
    return ['/', '/about', '/contact'].includes(item.to);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-soft"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          {user && (
            <button
              onClick={onMenuClick}
              className="lg:hidden rounded-full p-2 text-muted hover:bg-paper2 hover:text-ink"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-gradient text-primary-600 shadow-soft">
              <span className="font-japanese text-xl">あ</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold text-ink">NihongoFlash</div>
              <div className="text-xs text-muted">Paper-light learning</div>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-hidden mx-4 lg:mx-8">
          {!user && (
            <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-2 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(item.to)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-muted hover:bg-paper2 hover:text-ink'
                    }`}
                    aria-current={isActive(item.to) ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-border bg-surface p-2 text-muted transition hover:text-ink"
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            {resolvedTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {!user && (
            <>
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-1.5 rounded-full border border-border bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Link>
              <button
                className="rounded-full border border-border bg-surface p-2 text-muted transition hover:text-ink sm:hidden"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 lg:hidden" />}
              </button>
            </>
          )}

          {user && (
            <>
              <button
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="rounded-full border border-border bg-surface p-2 text-muted transition hover:text-red-600 hover:border-red-200"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {isOpen && !user && (
        <div className="border-t border-border bg-paper2 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col space-y-2 px-4 py-4">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive(item.to)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-muted hover:bg-surface hover:text-ink'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
