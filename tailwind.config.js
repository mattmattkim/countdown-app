/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-light': '#B8D4E3',
        'sky-medium': '#87CEEB',
        'card-white': '#FFFFFF',
        'text-primary': '#1a1a1a',
        'text-secondary': '#6b6b6b',
        'accent-blue': '#4A90E2',
        'accent-green': '#2E8B57',
        'accent-red': '#E74C3C',
        'accent-orange': '#F39C12',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 12px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}