// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFDF0',
          100: '#FFF9E0',
          200: '#FFF3C4',
          300: '#FFEC99',
          400: '#FFE066',
          500: '#FFD700', // اللون الأصفر الأساسي
          600: '#E6C200',
          700: '#B39500',
          800: '#806A00',
          900: '#4D3F00',
        },
        secondary: {
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#616161',
          600: '#424242',
          700: '#212121',
          800: '#000000', // الأسود
          900: '#000000',
        },
        white: '#FFFFFF',
        black: '#000000',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'sans-serif'],
        'sans': ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'custom': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'custom-lg': '0 4px 16px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addBase, addComponents, addUtilities }) {
      // إضافة دعم RTL
      addBase({
        'html': {
          direction: 'rtl',
        },
        'body': {
          fontFamily: 'Cairo, Tajawal, sans-serif',
        },
      });
      
      // مكونات مخصصة
      addComponents({
        '.btn-primary': {
          '@apply bg-primary-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200': {},
        },
        '.btn-secondary': {
          '@apply bg-secondary-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary-800 transition-colors duration-200': {},
        },
        '.card': {
          '@apply bg-white rounded-lg shadow-custom p-6': {},
        },
        '.input-field': {
          '@apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent': {},
        },
      });
      
      // أدوات مساعدة
      addUtilities({
        '.text-rtl': {
          direction: 'rtl',
        },
        '.text-ltr': {
          direction: 'ltr',
        },
      });
    },
  ],
}