/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'display': ['Lumios Typewriter', 'monospace'],
        'playfair': ['Playfair Display', 'serif'],
        'lumios': ['Lumios Typewriter', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        // Paleta kolorów pasująca do strony
        'brand': {
          50: '#f8f6f3',   // najjaśniejszy beż
          100: '#f0ebe4',  // bardzo jasny beż
          200: '#e3e0d8',  // główne tło strony
          300: '#d4cfc4',  // trochę ciemniejszy beż
          400: '#b8b0a0',  // średni beż
          500: '#8a8070',  // ciemniejszy beż
          600: '#5c5548',  // ciemny brąz
          700: '#3a3a3a',  // główny kolor tekstu
          800: '#2a2a2a',  // bardzo ciemny
          900: '#1a1a1a',  // najciemniejszy
        },
        'accent': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}; 