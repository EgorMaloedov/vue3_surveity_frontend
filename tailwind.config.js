/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'serif'],
      },
      colors: {
        primary: '#00A87F',
        primaryHover: '#00C78D',
        background: '#151419',
      },
    },
  },
  plugins: [],
}