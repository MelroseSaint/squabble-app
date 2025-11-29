/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Teko', 'sans-serif'],
      },
      colors: {
        'squabble-red': '#E50914',
        'squabble-dark': '#18191A',
        'squabble-gray': '#242526',
        'fb-bg': '#18191A',
        'fb-header': '#242526',
        'fb-card': '#242526',
        'fb-text': '#E4E6EB',
        'fb-text-secondary': '#B0B3B8',
        'fb-hover': '#3A3B3C',
        'fb-blue': '#2D88FF',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
