
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        'laser': '0 0 5px rgba(255, 0, 0, 0.7), 0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.7), 0 0 40px rgba(255, 0, 0, 0.7), 0 0 80px rgba(255, 0, 0, 0.7)',
      },
      animation: {
        'laser-pulse': 'laser-pulse 2s infinite',
      },
      keyframes: {
        'laser-pulse': {
          '0%, 100%': { textShadow: '0 0 5px rgba(255, 0, 0, 0.7), 0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.7)' },
          '50%': { textShadow: '0 0 10px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 1), 0 0 40px rgba(255, 0, 0, 1)' },
        },
      },
    },
  },
  plugins: [],
}
