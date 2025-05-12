/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#ede5fd',
          200: '#dccefa',
          300: '#c3a9f7',
          400: '#a880f0',
          500: '#8c55e8',
          600: '#7939de',
          700: '#682bc3',
          800: '#57259f',
          900: '#492282',
          950: '#2d1055',
        },
        secondary: {
          50: '#edfcfc',
          100: '#d2f5f4',
          200: '#aaebe9',
          300: '#71dbd9',
          400: '#41c4c1',
          500: '#25a7a4',
          600: '#1f8683',
          700: '#1f6c6a',
          800: '#1e5755',
          900: '#1d4948',
          950: '#0c2b2a',
        },
        blush: {
          50: '#fef1f7',
          100: '#fee5f0',
          200: '#fecce3',
          300: '#ffa3cb',
          400: '#fe6ca9',
          500: '#f83d85',
          600: '#e81d62',
          700: '#ca0c47',
          800: '#a70d3a',
          900: '#8b1033',
          950: '#550517',
        },
        neutral: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#5a5a5a',
          900: '#4e4e4e',
          950: '#282828',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};