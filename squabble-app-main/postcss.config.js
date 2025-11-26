// postcss.config.js
// Use ESM-friendly export and the new @tailwindcss/postcss plugin per Tailwind v4 guidance.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
