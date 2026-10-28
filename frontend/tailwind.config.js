/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0A0F1E',
        cyan: {
          400: '#00E5FF',
          500: '#00B8D4',
        },
        indigo: {
          500: '#4F46E5',
          600: '#4338CA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,229,255,0.3), 0 0 10px rgba(0,229,255,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(0,229,255,0.5), 0 0 40px rgba(0,229,255,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
