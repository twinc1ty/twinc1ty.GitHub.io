import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './components/**/*.{vue,ts,js}',
    './layouts/**/*.{vue,ts,js}',
    './pages/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0c0c10',
          darker: '#060608',
          surface: '#16161e',
          'surface-light': '#1e1e28',
          accent: '#7aa2f7',
          'accent-dim': '#7aa2f733',
          secondary: '#9ece6a',
          muted: '#565f89',
          text: '#c0caf5',
          'text-dim': '#a9b1d6',
          subtle: '#414868',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neon-accent': '0 0 5px #7aa2f7, 0 0 20px #7aa2f733',
        'neon-secondary': '0 0 5px #9ece6a, 0 0 20px #9ece6a33',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
