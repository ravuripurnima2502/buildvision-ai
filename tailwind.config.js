/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#0F1523',
          800: '#141C2D',
          700: '#1E293B',
          600: '#334155',
        },
        gold: {
          100: '#FAF5E4',
          200: '#F5E8BE',
          300: '#EED994',
          400: '#E5C466',
          500: '#D4AF37', // Classic metallic architectural gold
          600: '#B89228',
          700: '#91711A',
          800: '#6C5211',
          900: '#493608',
        },
        champagne: '#F7E7CE',
        silver: {
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
        },
        blueprint: {
          cyan: '#38BDF8',
          glow: 'rgba(56, 189, 248, 0.15)',
          grid: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cinzel', 'Outfit', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px -5px rgba(212, 175, 55, 0.35)',
        'silver-glow': '0 0 25px -5px rgba(226, 232, 240, 0.15)',
        'blueprint-glow': '0 0 30px -5px rgba(56, 189, 248, 0.2)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
