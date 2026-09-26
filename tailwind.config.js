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
          900: '#0B1017',
          850: '#0F1622',
          800: '#141D2C',
          750: '#1A2538',
          700: '#223046',
          600: '#334155',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF5E4',
          200: '#F5E8BE',
          300: '#EED994',
          400: '#E5C466',
          450: '#DBB954',
          500: '#D4A843', // Refined architectural warm brass gold
          550: '#C29835',
          600: '#B08828',
          700: '#8A691B',
          800: '#644B11',
          900: '#413008',
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
          cyan: '#0EA5E9',
          light: '#38BDF8',
          glow: 'rgba(14, 165, 233, 0.2)',
          grid: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 25px -4px rgba(212, 168, 67, 0.22)',
        'gold-glow-lg': '0 0 40px -4px rgba(212, 168, 67, 0.32)',
        'silver-glow': '0 0 25px -5px rgba(226, 232, 240, 0.12)',
        'blueprint-glow': '0 0 30px -5px rgba(14, 165, 233, 0.22)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'card-elevated': '0 12px 35px -5px rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
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
