import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import {
  Layers,
  LogOut,
  FolderKanban,
  Palette,
  ChevronRight,
  User,
  ShieldCheck,
  Building,
} from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-theme-base/80 backdrop-blur-xl transition-colors duration-200 select-none">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Architectural Mark */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3.5 cursor-pointer group"
          role="button"
          aria-label="BuildVision AI Home"
        >
          {/* Geometric Structural Mark */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-charcoal-800 to-charcoal-900 border border-gold-500/40 flex items-center justify-center shadow-gold-glow group-hover:border-gold-400 group-hover:scale-105 transition-all duration-300">
            {/* Architectural Isometric Wireframe Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-gold-400 group-hover:text-gold-300 transition-colors"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
              <path d="M12 22V12" strokeDasharray="1 1" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-charcoal-950"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-gold-100 transition-colors">
                BUILDVISION
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-gold-500/20 text-gold-400 border border-gold-500/40">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-medium">
              Civil BIM & Architectural Studio
            </span>
          </div>
        </div>

        {/* Center / Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'landing'
                ? 'bg-white/[0.08] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              currentView === 'dashboard'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30 shadow-gold-glow font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-gold-400" />
            <span>Projects Dashboard</span>
          </button>
        </nav>

        {/* Right Action Hub */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Theme Palette Quick Selector */}
          <button
            onClick={onOpenThemeSelector}
            title={`Current Theme: ${currentTheme.name} (Click to customize)`}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border border-white/[0.08] hover:border-gold-500/40 bg-white/[0.03] hover:bg-gold-500/10 text-slate-300 hover:text-gold-300 transition-all text-xs font-mono cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden md:inline text-[11px] font-medium">{currentTheme.name.split(' ')[0]}</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2.5 sm:space-x-3 pl-2 sm:pl-3 border-l border-white/[0.08]">
              {/* User Identity Pill */}
              <div
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-2.5 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-gold-500/30 cursor-pointer transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-500/30 to-amber-500/10 border border-gold-500/40 flex items-center justify-center text-gold-300 text-xs font-bold font-mono">
                  {user?.name ? user.name.trim().charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                </div>
                <div className="hidden md:block text-left pr-1">
                  <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {user?.name || user?.email?.split('@')[0] || 'Engineer'}
                  </p>
                  <p className="text-[9px] text-cyan-400 font-mono leading-tight flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>Neon DB</span>
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={async () => {
                  await logout();
                  window.location.hash = '#/';
                }}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn-gold flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide shadow-gold-glow cursor-pointer"
              >
                <span>Get Started</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
