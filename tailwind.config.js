/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blau: { 50: '#eff6ff', 100: '#dbeafe', 500: '#2563eb', 600: '#1d4ed8', 700: '#1e40af' },
        roig: { 50: '#fef2f2', 100: '#fee2e2', 500: '#dc2626', 600: '#b91c1c', 700: '#991b1b' },
        trinquet: { paret: '#f5efe3', linia: '#c8b89a', sol: '#e9dfcc', fosc: '#3b3226' },
        or: { 400: '#facc15', 500: '#eab308' },
      },
      fontFamily: {
        titol: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        cos: ['Nunito', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        puja: { '0%': { transform: 'translateY(0) scale(.8)', opacity: 0 }, '15%': { opacity: 1, transform: 'translateY(-10px) scale(1.15)' }, '100%': { transform: 'translateY(-90px) scale(1)', opacity: 0 } },
        bot: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        sacseja: { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-5px)' }, '75%': { transform: 'translateX(5px)' } },
        brilla: { '0%,100%': { boxShadow: '0 0 0 0 rgba(250,204,21,.0)' }, '50%': { boxShadow: '0 0 0 8px rgba(250,204,21,.55)' } },
        apareix: { '0%': { opacity: 0, transform: 'scale(.9)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        cau: { '0%': { transform: 'translateY(-20vh) rotate(0)', opacity: 1 }, '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: .9 } },
      },
      animation: {
        puja: 'puja 1.3s ease-out forwards',
        bot: 'bot .6s ease-in-out 2',
        sacseja: 'sacseja .35s ease-in-out 2',
        brilla: 'brilla 1s ease-in-out 2',
        apareix: 'apareix .2s ease-out',
        cau: 'cau 2.6s linear forwards',
      },
    },
  },
  plugins: [],
};
