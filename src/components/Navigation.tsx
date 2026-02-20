import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, BarChart3, Trophy, Info, Mail, Sun, Moon, Menu, X, Settings, Home } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/statistics', label: 'Stats', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const resolvedTheme =
    theme === 'system'
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

  const isActive = (path: string) => location.pathname === path;

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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-gradient text-primary-600 shadow-soft">
            <span className="font-japanese text-xl">あ</span>
          </div>
          <div>
            <div className="text-lg font-semibold text-ink">NihongoFlash</div>
            <div className="text-xs text-muted">Paper-light learning</div>
          </div>
        </Link>

        <nav className="hidden items-center space-x-2 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-border bg-surface p-2 text-muted transition hover:text-ink"
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            {resolvedTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            className="rounded-full border border-border bg-surface p-2 text-muted transition hover:text-ink lg:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-paper2 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col space-y-2 px-4 py-4">
            {navItems.map((item) => {
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
