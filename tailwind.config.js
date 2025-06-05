/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Choć mamy app router, zostawiam dla pewności
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Dla naszych komponentów
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Główny katalog dla App Routera
    "./app/components/Header.js", // Dodane na sztywno
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}; 