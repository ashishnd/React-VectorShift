/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        canvas: '#f4f4f5',
        'node-bg': '#ffffff',
        'node-border': '#e4e4e7',
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          muted: '#e0e7ff',
        },
        toolbar: {
          DEFAULT: '#18181b',
          hover: '#27272a',
        },
      },
      boxShadow: {
        node: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
