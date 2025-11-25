// tailwind.config.cjs
module.exports = {
    content: ['./index.html', './**/*.{js,ts,jsx,tsx,html}'],
    theme: {
        extend: {
            colors: {
                'squabble-red': '#E50914',
                'squabble-dark': '#141414',
                'squabble-gray': '#2F2F2F',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Teko', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
