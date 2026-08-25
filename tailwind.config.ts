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
          dark: 'var(--cyber-dark)',
          darker: 'var(--cyber-darker)',
          surface: 'var(--cyber-surface)',
          'surface-light': 'var(--cyber-surface-light)',
          accent: 'var(--cyber-accent)',
          'accent-dim': 'var(--cyber-accent-dim)',
          secondary: 'var(--cyber-secondary)',
          muted: 'var(--cyber-muted)',
          text: 'var(--cyber-text)',
          'text-dim': 'var(--cyber-text-dim)',
          subtle: 'var(--cyber-subtle)',
        },
        paper: '#FAFAF7',
        ink: '#0B0A0E',
        violet: {
          DEFAULT: '#5B21E0',
          deep: '#170B33',
          soft: '#EFEAFC',
          line: '#E1DAF5',
        },
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['Manrope', 'sans-serif'],
        'display-flat': ['Archivo', 'sans-serif'],
        'body-flat': ['Manrope', 'sans-serif'],
        'mono-flat': ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-accent': '2px 2px 0 var(--cyber-accent)',
        'neon-secondary': '2px 2px 0 var(--cyber-secondary)',
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
