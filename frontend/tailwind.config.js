/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EFE6D8',
          400: '#E5D6C0',
          500: '#D5BF9F',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FDFBF7',
          200: '#FAF6ED',
          300: '#F4ECE0',
          400: '#EADBCE',
        },
        peach: {
          50: '#FFF9F5',
          100: '#FDF2EC',
          200: '#FBE4D8',
          300: '#F7CEB9',
          400: '#F1A987',
          500: '#E87D4E',
        },
        lavender: {
          50: '#FAF8FC',
          100: '#F4F0F9',
          200: '#EAE1F3',
          300: '#D9C8EB',
          400: '#BFA4DE',
          500: '#9B74C9',
        },
        sage: {
          50: '#F7FAF8',
          100: '#EDF5F0',
          200: '#DDECE3',
          300: '#C2DBD0',
          400: '#9EBFB0',
          500: '#6E9684',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
        'float-drift': 'floatDrift 10s ease-in-out infinite',
        'float-quick': 'floatSlow 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-1.5deg)' },
        },
        floatDrift: {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(8px, -10px) rotate(1deg)' },
          '66%': { transform: 'translate(-6px, 8px) rotate(-1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
      }
    },
  },
  plugins: [],
}
