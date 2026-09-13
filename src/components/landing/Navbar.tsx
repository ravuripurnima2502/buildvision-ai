import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { Building2, LogOut, Sparkles, FolderKanban, Palette } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  currentView: 'landing' | 'dashboard' | 'workspace';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenThemeSelector: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  currentView,
  onNavigate,
  onOpenThemeSelector,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-theme-subtle bg-theme-surface/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-charcoal-950 stroke-[2.4]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-wider text-theme-primary flex items-center">
              BUILDVISION <span className="text-gold-400 ml-1">AI</span>
            </span>
            <span className="text-[10px] text-theme-secondary uppercase tracking-widest font-mono">
              Visualize • Understand • Build
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme Switcher Button */}
          <button
            onClick={onOpenThemeSelector}
            title={`Theme: ${currentTheme.name} (Click to change)`}
            className="p-2 rounded-xl border border-theme-subtle hover:border-gold-500/50 bg-theme-surface hover:bg-gold-500/10 text-theme-secondary hover:text-gold-400 transition-all flex items-center space-x-1.5 shadow-sm"
          >
            <Palette className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-mono hidden md:inline">{currentTheme.name.split(' ')[0]}</span>
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40 shadow-gold-glow'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-black/10'
                }`}
              >
                <FolderKanban className="w-4 h-4 text-gold-400" />
                <span className="hidden sm:inline">Projects Dashboard</span>
              </button>

              <div className="flex items-center space-x-3 pl-3 border-l border-theme-subtle">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold font-mono">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-medium text-theme-primary leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-theme-secondary leading-tight">{user?.company || user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-theme-secondary hover:text-red-400 hover:bg-black/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-semibold text-theme-secondary hover:text-gold-400 px-2 sm:px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 text-xs font-bold tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Get Started</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
