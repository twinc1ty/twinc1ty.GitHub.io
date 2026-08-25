let ctx: AudioContext | null = null
let initialized = false

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx || ctx.state === 'closed') {
    ctx = new AudioContext()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function tick(ac: AudioContext, time: number, freq: number, vol: number) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(freq, time)
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(vol, time + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(time)
  osc.stop(time + 0.06)
}

// Deck power-up: four ascending channel clicks, then a short low thump.
function playStartup() {
  const ac = ensureContext()
  if (!ac) return
  const now = ac.currentTime

  const freqs = [660, 880, 1100, 1400]
  freqs.forEach((f, i) => tick(ac, now + i * 0.09, f, 0.1))

  const thump = ac.createOscillator()
  const thumpGain = ac.createGain()
  thump.type = 'sine'
  thump.frequency.setValueAtTime(120, now + 0.4)
  thump.frequency.exponentialRampToValueAtTime(48, now + 0.55)
  thumpGain.gain.setValueAtTime(0, now + 0.4)
  thumpGain.gain.linearRampToValueAtTime(0.18, now + 0.42)
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
  thump.connect(thumpGain)
  thumpGain.connect(ac.destination)
  thump.start(now + 0.4)
  thump.stop(now + 0.72)
}

function playHover() {
  const ac = ensureContext()
  if (!ac) return
  tick(ac, ac.currentTime, 1500, 0.08)
}

function cleanup() {
  ctx?.close()
  ctx = null
  initialized = false
}

export function useAudio() {
  function init() {
    if (initialized) return
    initialized = true
    playStartup()
  }

  return { init, playHover, cleanup }
}
