import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'midnight' | 'white' | 'blueprint' | 'gradient' | 'sandstone';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  palette: {
    bg: string;
    surface: string;
    accent: string;
    border: string;
    text: string;
  };
  isDark: boolean;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'midnight',
    name: 'Midnight Luxury',
    subtitle: 'Deep charcoal, metallic gold & silver highlights',
    palette: {
      bg: '#070A0F',
      surface: '#0F1523',
      accent: '#D4AF37',
      border: 'rgba(212, 175, 55, 0.3)',
      text: '#F1F5F9',
    },
    isDark: true,
  },
  {
    id: 'white',
    name: 'Architectural White',
    subtitle: 'Studio white, travertine grey & champagne accents',
    palette: {
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      accent: '#B89228',
      border: '#E2E8F0',
      text: '#0F172A',
    },
    isDark: false,
  },
  {
    id: 'blueprint',
    name: 'Sky Blueprint',
    subtitle: 'Engineering navy, technical cyan & grid patterns',
    palette: {
      bg: '#081325',
      surface: '#0D203D',
      accent: '#38BDF8',
      border: 'rgba(56, 189, 248, 0.3)',
      text: '#E0F2FE',
    },
    isDark: true,
  },
  {
    id: 'gradient',
    name: 'Gradient Premium',
    subtitle: 'Deep royal violet, indigo & architectural glass',
    palette: {
      bg: '#0D081D',
      surface: '#170E30',
      accent: '#C084FC',
      border: 'rgba(192, 132, 252, 0.3)',
      text: '#F5F3FF',
    },
    isDark: true,
  },
  {
    id: 'sandstone',
    name: 'Warm Sandstone',
    subtitle: 'Natural earth tones, sand beige & bronze stone',
    palette: {
      bg: '#17130E',
      surface: '#251E17',
      accent: '#D97706',
      border: 'rgba(217, 119, 6, 0.3)',
      text: '#FEF3C7',
    },
    isDark: true,
  },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  currentTheme: ThemeOption;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY_THEME = 'buildvision_theme_v1';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved && THEMES.some(t => t.id === saved)) {
        return saved as ThemeId;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for theme:', e);
    }
    return 'midnight';
  });

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {
      console.warn('Unable to persist theme:', e);
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (currentTheme.isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme, currentTheme]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        currentTheme,
        isDark: currentTheme.isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
