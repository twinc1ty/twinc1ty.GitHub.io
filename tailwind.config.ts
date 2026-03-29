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
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neon-accent': '0 0 5px var(--cyber-accent), 0 0 20px var(--cyber-accent-dim)',
        'neon-secondary': '0 0 5px var(--cyber-secondary), 0 0 20px color-mix(in srgb, var(--cyber-secondary) 20%, transparent)',
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
