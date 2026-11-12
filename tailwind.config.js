/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        accent: '#F59E0B',
        muted: '#64748B',
        surface: '#F3F4F6',
        highlight: '#10B981',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        heading: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
  },
  // Existing content lines will follow

    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {}
    },
    plugins: []
};
