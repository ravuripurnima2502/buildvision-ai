import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import {
  X,
  Mail,
  User as UserIcon,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
  WifiOff,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { signIn, signUp, resetPassword, isConfigured } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Email verification pending screen
  if (awaitingVerification) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-md rounded-2xl bg-charcoal-900/95 border border-gold-500/30 p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-2">Check Your Email</h2>
          <p className="text-slate-400 text-sm mb-6">
            We sent a verification link to <span className="text-gold-300 font-semibold">{email}</span>.<br />
            Click the link in the email to activate your account, then sign in below.
          </p>
          <button
            onClick={() => { setAwaitingVerification(false); setMode('login'); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 font-bold text-sm tracking-wide hover:brightness-110 transition-all"
          >
            Go to Sign In
          </button>
          <button
            onClick={onClose}
            className="mt-3 w-full py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white hover:border-slate-500 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleModeSwitch = (newMode: 'login' | 'register' | 'forgot_password') => {
    resetForm();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid professional email address.');
      return;
    }

    if (mode === 'forgot_password') {
      setLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMessage('A password reset confirmation has been saved.');
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to dispatch reset instructions.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password && confirmPassword && password !== confirmPassword) {
        setErrorMessage('Password confirmation does not match.');
        return;
      }

      setLoading(true);
      try {
        const result = await signUp(email.trim(), password, fullName.trim(), company.trim());
        if (result?.needEmailVerification) {
          setAwaitingVerification(true);
        } else {
          onClose();
          window.location.hash = '#/dashboard';
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else {
      // Local Login
      setLoading(true);
      try {
        await signIn(email.trim(), password);
        onClose();
        window.location.hash = '#/dashboard';
      } catch (err: any) {
        setErrorMessage(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md animate-fadeIn select-none">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#0B1017]/95 border border-gold-500/40 p-7 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow">
              <Building2 className="w-5 h-5 text-charcoal-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-wider text-white">
                BUILDVISION <span className="text-gold-400">AI</span>
              </span>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                Civil Engineering BIM
              </p>
            </div>
          </div>
          {/* Auth backend indicator */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono ${
            isConfigured
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-white/[0.04] border border-white/[0.08] text-slate-400'
          }`}>
            {isConfigured
              ? <><Database className="w-3 h-3" /><span>Neon DB</span></>
              : <><WifiOff className="w-3 h-3" /><span>Local Mode</span></>}
          </div>
        </div>

        {/* Main Modes: Sign In, Sign Up, Forgot Password */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            {mode === 'login'
              ? 'Sign In to Workspace'
              : mode === 'register'
              ? 'Create Engineering Profile'
              : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
            {mode === 'login'
              ? 'Access your private BIM projects, 3D floor cutaways, and turnkey estimation analytics.'
              : mode === 'register'
              ? 'Join BuildVision AI with your architectural studio or civil engineering credentials.'
              : 'Enter your registered email to receive a password reset link.'}
          </p>
        </div>

        {/* Error & Success Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wider font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ar. Rajesh Mehta"
                    className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wider font-mono">
                  Studio or Firm Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Premier Architectural Studio"
                    className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wider font-mono">
              Professional Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@architecturestudio.com"
                className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
              />
            </div>
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-300 uppercase tracking-wider font-mono">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot_password')}
                    className="text-[11px] text-gold-400 hover:text-gold-300 hover:underline font-mono cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 uppercase tracking-wider font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 rounded-xl btn-gold font-bold text-sm tracking-wide transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer font-sans"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Opening Workspace...</span>
              </span>
            ) : (
              <>
                <span>
                  {mode === 'login'
                    ? 'Enter Workspace'
                    : mode === 'register'
                    ? 'Create Profile & Enter'
                    : 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <span>
              New to BuildVision AI?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className="text-gold-400 hover:underline font-semibold cursor-pointer"
              >
                Register Profile
              </button>
            </span>
          ) : mode === 'register' ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="text-gold-400 hover:underline font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Remembered credentials?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="text-gold-400 hover:underline font-semibold cursor-pointer"
              >
                Back to Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
