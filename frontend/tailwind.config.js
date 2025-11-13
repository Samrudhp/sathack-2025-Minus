/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#f5f0e6',
          light: '#faf7f0',
          dark: '#e8e0d1'
        },
        forest: {
          DEFAULT: '#2f5233',
          light: '#3d6b42',
          dark: '#1f3522'
        },
        olive: {
          DEFAULT: '#afc3a2',
          light: '#c5d4ba',
          dark: '#97ad89'
        },
        hazard: {
          DEFAULT: '#b73939',
          light: '#d34848',
          dark: '#952d2d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'coin-flip': 'coinFlip 0.6s ease-in-out',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        coinFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
