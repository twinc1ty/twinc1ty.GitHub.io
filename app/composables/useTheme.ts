interface ColorTheme {
  name: string
  dark: string
  darker: string
  surface: string
  surfaceLight: string
  accent: string       // hex like #e8c89a
  accentRgb: string    // "232, 200, 154" for rgba() usage
  secondary: string
  secondaryRgb: string
  muted: string
  text: string
  textDim: string
  subtle: string
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

// Derive lighter/darker shades from a base color
function lighten(hex: string, amount: number): string {
  const h = hex.replace('#', '')
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + amount)
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + amount)
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function darken(hex: string, amount: number): string {
  const h = hex.replace('#', '')
  const r = Math.max(0, parseInt(h.substring(0, 2), 16) - amount)
  const g = Math.max(0, parseInt(h.substring(2, 4), 16) - amount)
  const b = Math.max(0, parseInt(h.substring(4, 6), 16) - amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const themes: ColorTheme[] = [
  // Vector Heart — Printstream-inspired (default) — white on black
  {
    name: 'vector-heart',
    dark: '#0a0a0a',
    darker: '#050505',
    surface: '#111111',
    surfaceLight: '#1a1a1a',
    accent: '#f0ede8',
    accentRgb: hexToRgb('#f0ede8'),
    secondary: '#c41e3a',
    secondaryRgb: hexToRgb('#c41e3a'),
    muted: '#888880',
    text: '#f0ede8',
    textDim: '#a8a4a0',
    subtle: '#333333',
  },
  // Cyber Blue
  {
    name: 'cyber-blue',
    dark: '#0c0c10',
    darker: '#060608',
    surface: '#16161e',
    surfaceLight: '#1e1e28',
    accent: '#7aa2f7',
    accentRgb: hexToRgb('#7aa2f7'),
    secondary: '#9ece6a',
    secondaryRgb: hexToRgb('#9ece6a'),
    muted: '#565f89',
    text: '#c0caf5',
    textDim: '#a9b1d6',
    subtle: '#414868',
  },
  // Soft Red
  {
    name: 'soft-red',
    dark: '#11131a',
    darker: '#090a10',
    surface: '#1a1520',
    surfaceLight: '#241c2a',
    accent: '#c45858',
    accentRgb: hexToRgb('#c45858'),
    secondary: '#c48068',
    secondaryRgb: hexToRgb('#c48068'),
    muted: '#7a5565',
    text: '#e0c0c0',
    textDim: '#c6a9b0',
    subtle: '#5a3a44',
  },
]

let currentTheme: ColorTheme | null = null

export function useTheme() {
  function applyTheme(theme: ColorTheme) {
    currentTheme = theme
    const root = document.documentElement.style

    root.setProperty('--cyber-dark', theme.dark)
    root.setProperty('--cyber-darker', theme.darker)
    root.setProperty('--cyber-surface', theme.surface)
    root.setProperty('--cyber-surface-light', theme.surfaceLight)
    root.setProperty('--cyber-accent', theme.accent)
    root.setProperty('--cyber-accent-rgb', theme.accentRgb)
    root.setProperty('--cyber-accent-dim', `${theme.accent}33`)
    root.setProperty('--cyber-secondary', theme.secondary)
    root.setProperty('--cyber-secondary-rgb', theme.secondaryRgb)
    root.setProperty('--cyber-muted', theme.muted)
    root.setProperty('--cyber-text', theme.text)
    root.setProperty('--cyber-text-dim', theme.textDim)
    root.setProperty('--cyber-subtle', theme.subtle)
  }

  // Always starts with vector-heart; cycles randomly through the rest on refresh
  function initRandomTheme() {
    applyTheme(themes[0]!)
  }

  function getTheme(): ColorTheme | null {
    return currentTheme
  }

  function getAccentHex(): number {
    if (!currentTheme) return 0xe8c89a
    return parseInt(currentTheme.accent.replace('#', ''), 16)
  }

  return { initRandomTheme, applyTheme, getTheme, getAccentHex, themes }
}
