/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#f03a5f',
          darkRed: '#d92348',
          gold: '#f59e0b',
          blue: '#2563eb',
          bg: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}
