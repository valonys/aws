/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#002B5B',
        accent: '#F5A623',
        surface: '#0B1E36',
        'surface-light': '#142C4A',
      },
      fontFamily: {
        sans: ['"Tw Cen MT"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
