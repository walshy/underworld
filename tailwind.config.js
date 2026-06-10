/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f0f0f',
        'bg-secondary': '#1a1a1a',
        'bg-tertiary': '#222222',
        'border-default': '#2a2a2a',
        'border-accent': '#3a3a3a',
        felt: '#1a3a2a',
        'dealer-zone': '#0d2a1a',
        gold: {
          DEFAULT: '#f5c518',
          muted: '#c9a010',
          subtle: '#2a2100',
        },
        danger: '#e53e3e',
        success: '#38a169',
        warning: '#d97706',
      },
      textColor: {
        primary: '#f0f0f0',
        secondary: '#888888',
        muted: '#555555',
      },
      borderColor: {
        DEFAULT: '#2a2a2a',
        accent: '#3a3a3a',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      width: {
        sidebar: '220px',
      },
      height: {
        header: '56px',
      },
      minHeight: {
        header: '56px',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
