import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, BarChart3, Trophy, Settings, Home, Map, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProgressStore } from '../contexts/ProgressContext';

const navItems = [
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/kana-city', label: 'Kana City', icon: Map },
  { to: '/ai-coach', label: 'AI Coach', icon: Sparkles },
  { to: '/statistics', label: 'Stats', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { state } = useProgressStore();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full transform border-r border-border bg-paper transition-all duration-300 ease-in-out lg:relative lg:z-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-full flex-col relative">
          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-soft transition hover:text-ink z-50"
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          <div className="flex h-16 items-center justify-between px-6 lg:hidden">
            <span className="text-lg font-bold">Menu</span>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-paper-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={`flex flex-col items-center py-8 px-4 border-b border-border mb-4 transition-all ${isCollapsed ? 'px-2' : ''}`}>
             <div className={`flex items-center justify-center rounded-full bg-warm-gradient text-primary-600 shadow-soft mb-3 transition-all ${isCollapsed ? 'h-10 w-10' : 'h-16 w-16'}`}>
              <span className={`font-japanese transition-all ${isCollapsed ? 'text-xl' : 'text-3xl'}`}>あ</span>
            </div>
            {!isCollapsed && (
              <div className="text-center animate-fadeIn">
                <div className="text-sm font-extrabold text-primary-600 tracking-wide">LVL {state.gamification?.level || 1}</div>
                <div className="text-[10px] font-medium text-muted uppercase">{state.gamification?.xp || 0} XP</div>
              </div>
            )}
          </div>

          <nav className={`flex-1 space-y-1 px-3 ${isCollapsed ? 'px-2' : ''}`}>
            <Link
              to="/"
              className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-muted hover:bg-paper-2 hover:text-ink'
              } ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-4'}`}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              title={isCollapsed ? 'Home' : ''}
            >
              <Home className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Home</span>}
            </Link>

            <div className={`mt-4 mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-muted/50 transition-all ${isCollapsed ? 'opacity-0 h-0 pointer-events-none' : ''}`}>
              Learning
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all ${
                    isActive(item.to)
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-muted hover:bg-paper-2 hover:text-ink'
                  } ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-4'}`}
                  onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className={`border-t border-border p-4 transition-all ${isCollapsed ? 'p-2 items-center flex justify-center' : ''}`}>
            {isCollapsed ? (
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-warm-gradient text-primary-600 shadow-soft cursor-help" title={`Daily Goal: ${(state.gamification?.xp || 0) % 100}%`}>
                <Trophy className="h-5 w-5" />
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white shadow-paper animate-fadeIn">
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">Daily Goal</p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div 
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" 
                    style={{ width: `${Math.min((state.gamification?.xp || 0) % 100, 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold">Keep going!</p>
                  <p className="text-[11px] font-bold">{(state.gamification?.xp || 0) % 100}/100 XP</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
