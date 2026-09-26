import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { User } from '../../types/project';
import { loadStoredUser, saveStoredUser } from '../../utils/storage';
import { isNeonConfigured } from '../../services/neon';
import {
  initSchema,
  signIn as neonSignIn,
  signUp as neonSignUp,
  signOut as neonSignOut,
  verifySession,
  requestPasswordReset,
  getStoredSession,
  clearSession,
} from '../../services/authService';

// ================================================================
// Auth Context — Dual-mode: Neon PostgreSQL + localStorage fallback
// ================================================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (
    email: string,
    password?: string,
    fullName?: string,
    company?: string
  ) => Promise<{ needEmailVerification?: boolean }>;
  signIn: (email: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, name?: string, company?: string) => void;
  register: (email: string, name: string, company?: string) => void;
  resetPassword: (email: string) => Promise<void>;
}

const DEFAULT_LOCAL_USER: User = {
  id: 'usr_architect_default',
  email: 'architect@buildvision.ai',
  name: 'Lead Architect',
  company: 'Premier Architectural Studio',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================================================================
// AuthProvider
// ================================================================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sessionTokenRef = useRef<string | null>(null);
  const initialized = useRef(false);

  // ---------------------------------------------------------------
  // Initialize on mount — check stored session
  // ---------------------------------------------------------------
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      setIsLoading(true);
      try {
        if (isNeonConfigured) {
          // Initialize schema (idempotent — safe to call every time)
          await initSchema();

          // Check if there's a stored session
          const stored = getStoredSession();
          if (stored) {
            // Verify session is still valid in DB
            const verified = await verifySession(stored.token);
            if (verified) {
              sessionTokenRef.current = verified.token;
              setUser({
                id: verified.userId,
                email: verified.email,
                name: verified.fullName || verified.email.split('@')[0],
                company: verified.company || '',
                createdAt: new Date().toISOString(),
              });
            } else {
              clearSession();
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } else {
          // Local fallback
          const saved = loadStoredUser();
          setUser(saved || DEFAULT_LOCAL_USER);
          if (!saved) saveStoredUser(DEFAULT_LOCAL_USER);
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
        // Fallback gracefully
        const saved = loadStoredUser();
        setUser(saved || DEFAULT_LOCAL_USER);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  // ---------------------------------------------------------------
  // SIGN IN
  // ---------------------------------------------------------------
  const signIn = useCallback(async (email: string, password?: string) => {
    if (isNeonConfigured) {
      setIsLoading(true);
      try {
        const session = await neonSignIn(email, password || '');
        sessionTokenRef.current = session.token;
        setUser({
          id: session.userId,
          email: session.email,
          name: session.fullName || session.email.split('@')[0],
          company: session.company || '',
          createdAt: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      login(email);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------
  // SIGN UP
  // ---------------------------------------------------------------
  const signUp = useCallback(
    async (email: string, password?: string, fullName?: string, company?: string) => {
      if (isNeonConfigured) {
        setIsLoading(true);
        try {
          const session = await neonSignUp(
            email,
            password || '',
            fullName || email.split('@')[0],
            company || ''
          );
          sessionTokenRef.current = session.token;
          setUser({
            id: session.userId,
            email: session.email,
            name: session.fullName || session.email.split('@')[0],
            company: session.company || '',
            createdAt: new Date().toISOString(),
          });
          return { needEmailVerification: false };
        } finally {
          setIsLoading(false);
        }
      } else {
        login(email, fullName, company);
        return { needEmailVerification: false };
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ---------------------------------------------------------------
  // SIGN OUT
  // ---------------------------------------------------------------
  const signOut = useCallback(async () => {
    if (isNeonConfigured) {
      setIsLoading(true);
      try {
        await neonSignOut(sessionTokenRef.current || '');
        sessionTokenRef.current = null;
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(null);
      saveStoredUser(null);
    }
  }, []);

  // ---------------------------------------------------------------
  // RESET PASSWORD
  // ---------------------------------------------------------------
  const resetPassword = useCallback(async (email: string) => {
    if (isNeonConfigured) {
      await requestPasswordReset(email);
    }
  }, []);

  // ---------------------------------------------------------------
  // LOCAL-ONLY helpers (kept for backward compat + fallback mode)
  // ---------------------------------------------------------------
  const login = useCallback((email: string, name?: string, company?: string) => {
    const cleanEmail = email.trim();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split('@')[0] || 'Architect',
      company: company?.trim() || 'Premier Architectural Studio',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    saveStoredUser(newUser);
  }, []);

  const register = useCallback(
    (email: string, name: string, company?: string) => login(email, name, company),
    [login]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isConfigured: isNeonConfigured,
        signUp,
        signIn,
        signOut,
        logout: signOut,
        login,
        register,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
