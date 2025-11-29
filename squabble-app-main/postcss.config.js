// postcss.config.js
// Explicitly point Tailwind to the CJS config to avoid ambiguity on Vercel builds.
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss({ config: './tailwind.config.cjs' }),
    autoprefixer(),
  ],
};
