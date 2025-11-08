/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#27ae60',
        'primary-green-dark': '#229954',
        'accent-orange': '#E67E22',
        'accent-orange-dark': '#D35400',
        'dark-slate': '#2c3e50',
      }
    },
  },
  plugins: [],
}
