/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0a0015',
          800: '#1a0033',
          700: '#2d0052',
          600: '#4a0080',
          500: '#7000ff',
          400: '#9333ff',
          300: '#b366ff',
          200: '#d199ff',
          100: '#e6ccff',
        },
        secondary: {
          900: '#001a0d',
          800: '#003319',
          700: '#004d26',
          600: '#006633',
          500: '#00ff88',
          400: '#33ffaa',
          300: '#66ffbb',
          200: '#99ffcc',
          100: '#ccffee',
        },
        accent: {
          blood: '#ff0066',
          bone: '#e0e0ff',
          gold: '#ffd700',
          orange: '#ff6600',
        },
        health: {
          healthy: '#00ff88',
          stale: '#ffaa00',
          dead: '#ff0066',
        },
        ghost: 'rgba(255, 255, 255, 0.3)',
      },
      fontFamily: {
        creepster: ['Creepster', 'cursive'],
        body: ['Roboto', 'sans-serif'],
        code: ['Roboto Mono', 'monospace'],
        epitaph: ['Nosifer', 'cursive'],
        handwriting: ['Shadows Into Light', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in-ghost': 'fadeInGhost 0.8s ease-out forwards',
        'flicker': 'flicker 4s ease-in-out infinite',
        'blood-drip': 'bloodDrip 3s ease-in forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #7000ff' },
          '50%': { boxShadow: '0 0 30px #9333ff' },
        },
        fadeInGhost: {
          'from': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          'to': { opacity: '0.6', transform: 'scale(1) translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.9' },
        },
        bloodDrip: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(112, 0, 255, 0.8)',
        'blood': '0 0 30px rgba(255, 0, 102, 0.6)',
        'ghost': '0 0 40px rgba(0, 255, 136, 0.5)',
      },
    },
  },
  plugins: [],
}
