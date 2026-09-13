import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Shield, Sparkles, X, Mail, User as UserIcon, Building2, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid professional email address.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      register(email.trim(), name.trim(), company.trim());
    } else {
      login(email.trim());
    }
    onClose();
  };

  const handleDemoLogin = () => {
    login('architect@buildvision.ai', 'Vikramaditya Sharma');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Background blueprint subtle effect */}
      <div className="relative w-full max-w-md rounded-2xl glass-panel-gold p-8 border border-gold-500/30 blueprint-grid shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-gold-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow">
            <Building2 className="w-6 h-6 text-charcoal-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-wider text-gold-300">
              BUILDVISION <span className="text-white">AI</span>
            </span>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
              Next-Gen Civil Visualization
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-display text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Engineering Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your architectural models, change impacts & estimates.'
              : 'Join the premier platform for 3D construction visualization.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ar. Rajesh Mehta"
                    className="w-full bg-charcoal-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Firm or Studio (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Studio Vertex Designs"
                    className="w-full bg-charcoal-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@architecturefirm.com"
                className="w-full bg-charcoal-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 font-semibold text-sm tracking-wide shadow-gold-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <span>{mode === 'login' ? 'Sign In to Workspace' : 'Initialize Account'}</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col space-y-3">
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-charcoal-800/80 hover:bg-charcoal-700 border border-gold-500/20 text-xs font-medium text-gold-300 hover:text-gold-200 transition-all flex items-center justify-center space-x-2"
          >
            <Shield className="w-3.5 h-3.5 text-gold-400" />
            <span>Instant Demo Access (Architect Profile)</span>
          </button>

          <div className="text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <span>
                New to BuildVision AI?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-gold-400 hover:underline font-semibold"
                >
                  Register Now
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-gold-400 hover:underline font-semibold"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
