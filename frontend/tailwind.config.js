/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefdf3',
          100: '#d6f9e2',
          200: '#b0f1c9',
          300: '#7ce5aa',
          400: '#43d086',
          500: '#1fb56a',
          600: '#149355',
          700: '#137548',
          800: '#135d3c',
          900: '#114d33',
          950: '#052b1c',
        },
        dark: {
          800: '#0f172a',
          900: '#0a0f1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
