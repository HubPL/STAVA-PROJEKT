/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Plus Jakarta Sans', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'playfair': ['Plus Jakarta Sans', 'sans-serif'],
        'lumios': ['Plus Jakarta Sans', 'sans-serif'],
        'plus-jakarta-sans': ['Plus Jakarta Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        // Nowa paleta kolorów STAVA
        'brand': {
          50: '#fdf9f0',   // najjaśniejszy beż
          100: '#fdf2d0',  // główny nowy beż (tło strony)
          200: '#fbeabb',  // jaśniejszy odcień
          300: '#f7de9c',  // średni beż
          400: '#f0cc73',  // ciemniejszy beż
          500: '#e6b54a',  // akcent beżowy
          600: '#d49e2e',  // ciemny beż
          700: '#3c3333',  // główny nowy kolor tekstu (ciemny brąz)
          800: '#2d2626',  // ciemniejszy brąz
          900: '#1f1a1a',  // najciemniejszy
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