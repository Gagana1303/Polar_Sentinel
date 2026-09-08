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
        // Precise Polar Palette
        polar: {
          bg: '#F6F8F7',
          surface: '#FFFFFF',
          secondarySurface: '#F0F4F2',
          text: '#14201D',
          textSecondary: '#6B7773',
          muted: '#9AA5A1',
          accent: '#087F6B',
          secondaryAccent: '#8CBDB4',
          iceBlue: '#A8D8E8',
          warning: '#D99A25',
          critical: '#C94A5A',
          success: '#258A68',
        },
        darkPolar: {
          bg: '#0C1210',
          surface: '#141C19',
          elevated: '#1A2420',
          text: '#F4F7F5',
          textSecondary: '#A6B1AD',
          accent: '#62C7B5',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.875rem', // 14px
        '2xl': '1.125rem', // 18px
        '3xl': '1.5rem',   // 24px
        '4xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(20, 32, 29, 0.03)',
        'subtle-md': '0 6px 20px rgba(20, 32, 29, 0.05)',
        'subtle-lg': '0 12px 32px rgba(20, 32, 29, 0.07)',
        'glow-accent': '0 0 20px rgba(8, 127, 107, 0.18)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
