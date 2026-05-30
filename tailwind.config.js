/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FAF0F2',
          100: '#F5E6E8', // User blush pink
          200: '#EAD1D5',
          300: '#DEBCC2',
          400: '#D2A7AF',
          500: '#C6929C',
        },
        rosegold: {
          50: '#FAF4ED',
          100: '#ECCFA8',
          200: '#E2BD8A',
          300: '#D7AC6B',
          400: '#C49A6C', // User Rose Gold
          500: '#B0885B',
          600: '#9C764A',
        },
        lavender: {
          50: '#FAF8FC',
          100: '#EADFF5',
          200: '#DAC6ED',
          300: '#C5A7E2',
          400: '#B188D7',
          500: '#9E6ECC',
        },
        nude: {
          50: '#FFFBF9',
          100: '#FAF0EB',
          200: '#F5E5DC',
          300: '#EBD0C2',
          400: '#DFBBA8',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-fast': 'float-fast 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(-25px) rotate(-3deg) scale(1.03)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
