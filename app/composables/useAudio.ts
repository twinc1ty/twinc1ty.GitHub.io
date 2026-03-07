let ctx: AudioContext | null = null
let humOsc: OscillatorNode | null = null
let humLfo: OscillatorNode | null = null
let hum2: OscillatorNode | null = null
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

function createNoise(ac: AudioContext, duration: number): AudioBufferSourceNode {
  const bufferSize = ac.sampleRate * duration
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1)
  }
  const node = ac.createBufferSource()
  node.buffer = buffer
  return node
}

function playStartup() {
  const ac = ensureContext()
  if (!ac) return

  const now = ac.currentTime

  // Deep sub-bass rumble — reactor powering on
  const sub = ac.createOscillator()
  const subGain = ac.createGain()
  sub.type = 'sawtooth'
  sub.frequency.setValueAtTime(28, now)
  sub.frequency.linearRampToValueAtTime(55, now + 2.5)
  sub.frequency.linearRampToValueAtTime(40, now + 3.5)
  subGain.gain.setValueAtTime(0, now)
  subGain.gain.linearRampToValueAtTime(0.15, now + 0.8)
  subGain.gain.setValueAtTime(0.15, now + 2.5)
  subGain.gain.linearRampToValueAtTime(0, now + 4)

  const subFilter = ac.createBiquadFilter()
  subFilter.type = 'lowpass'
  subFilter.frequency.value = 120
  subFilter.Q.value = 2

  sub.connect(subFilter)
  subFilter.connect(subGain)
  subGain.connect(ac.destination)
  sub.start(now)
  sub.stop(now + 4)

  // Mid-range growl — distorted harmonic
  const mid = ac.createOscillator()
  const midGain = ac.createGain()
  mid.type = 'sawtooth'
  mid.frequency.setValueAtTime(55, now)
  mid.frequency.linearRampToValueAtTime(110, now + 2)
  mid.frequency.linearRampToValueAtTime(80, now + 3.5)
  midGain.gain.setValueAtTime(0, now)
  midGain.gain.linearRampToValueAtTime(0.07, now + 1.2)
  midGain.gain.linearRampToValueAtTime(0, now + 3.8)

  const midFilter = ac.createBiquadFilter()
  midFilter.type = 'lowpass'
  midFilter.frequency.setValueAtTime(100, now)
  midFilter.frequency.linearRampToValueAtTime(300, now + 2)
  midFilter.frequency.linearRampToValueAtTime(150, now + 3.5)
  midFilter.Q.value = 4

  mid.connect(midFilter)
  midFilter.connect(midGain)
  midGain.connect(ac.destination)
  mid.start(now)
  mid.stop(now + 4)

  // Filtered noise sweep — hiss that builds and fades
  const noise = createNoise(ac, 4)
  const noiseGain = ac.createGain()
  const noiseFilter = ac.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.setValueAtTime(200, now)
  noiseFilter.frequency.linearRampToValueAtTime(800, now + 2)
  noiseFilter.frequency.linearRampToValueAtTime(300, now + 3.5)
  noiseFilter.Q.value = 3
  noiseGain.gain.setValueAtTime(0, now)
  noiseGain.gain.linearRampToValueAtTime(0.04, now + 1.5)
  noiseGain.gain.linearRampToValueAtTime(0, now + 3.8)

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ac.destination)
  noise.start(now)
  noise.stop(now + 4)

  // Distant metallic ping at the end — cold confirmation
  const ping = ac.createOscillator()
  const pingGain = ac.createGain()
  ping.type = 'sine'
  ping.frequency.setValueAtTime(220, now + 2.8)
  ping.frequency.exponentialRampToValueAtTime(180, now + 3.5)
  pingGain.gain.setValueAtTime(0, now + 2.8)
  pingGain.gain.linearRampToValueAtTime(0.06, now + 2.85)
  pingGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6)

  const pingFilter = ac.createBiquadFilter()
  pingFilter.type = 'bandpass'
  pingFilter.frequency.value = 220
  pingFilter.Q.value = 8

  ping.connect(pingFilter)
  pingFilter.connect(pingGain)
  pingGain.connect(ac.destination)
  ping.start(now + 2.8)
  ping.stop(now + 3.8)
}

function startHum() {
  const ac = ensureContext()
  if (!ac) return

  // Low drone
  humOsc = ac.createOscillator()
  const humGain = ac.createGain()
  humOsc.type = 'sine'
  humOsc.frequency.value = 48
  humGain.gain.value = 0.018

  // LFO for subtle pulsing
  humLfo = ac.createOscillator()
  const lfoGain = ac.createGain()
  humLfo.frequency.value = 0.25
  lfoGain.gain.value = 4
  humLfo.connect(lfoGain)
  lfoGain.connect(humOsc.frequency)
  humLfo.start()

  // Second harmonic layer
  hum2 = ac.createOscillator()
  hum2.type = 'triangle'
  hum2.frequency.value = 96

  // Low-pass filter
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 200
  filter.Q.value = 1

  humOsc.connect(filter)
  hum2.connect(filter)
  filter.connect(humGain)
  humGain.connect(ac.destination)

  humOsc.start()
  hum2.start()
}

function playHover() {
  const ac = ensureContext()
  if (!ac) return

  const now = ac.currentTime

  // Deep industrial horn — low sawtooth swell
  const horn = ac.createOscillator()
  const hornGain = ac.createGain()
  horn.type = 'sawtooth'
  horn.frequency.setValueAtTime(38, now)
  horn.frequency.linearRampToValueAtTime(45, now + 0.15)
  horn.frequency.linearRampToValueAtTime(40, now + 0.5)
  hornGain.gain.setValueAtTime(0, now)
  hornGain.gain.linearRampToValueAtTime(0.12, now + 0.05)
  hornGain.gain.setValueAtTime(0.12, now + 0.25)
  hornGain.gain.linearRampToValueAtTime(0, now + 0.5)

  const hornFilter = ac.createBiquadFilter()
  hornFilter.type = 'lowpass'
  hornFilter.frequency.value = 150
  hornFilter.Q.value = 3

  horn.connect(hornFilter)
  hornFilter.connect(hornGain)
  hornGain.connect(ac.destination)
  horn.start(now)
  horn.stop(now + 0.55)

  // Second harmonic — adds body
  const horn2 = ac.createOscillator()
  const horn2Gain = ac.createGain()
  horn2.type = 'sawtooth'
  horn2.frequency.setValueAtTime(76, now)
  horn2.frequency.linearRampToValueAtTime(90, now + 0.15)
  horn2.frequency.linearRampToValueAtTime(80, now + 0.5)
  horn2Gain.gain.setValueAtTime(0, now)
  horn2Gain.gain.linearRampToValueAtTime(0.05, now + 0.05)
  horn2Gain.gain.setValueAtTime(0.05, now + 0.25)
  horn2Gain.gain.linearRampToValueAtTime(0, now + 0.5)

  const horn2Filter = ac.createBiquadFilter()
  horn2Filter.type = 'lowpass'
  horn2Filter.frequency.value = 200
  horn2Filter.Q.value = 2

  horn2.connect(horn2Filter)
  horn2Filter.connect(horn2Gain)
  horn2Gain.connect(ac.destination)
  horn2.start(now)
  horn2.stop(now + 0.55)

  // Noise texture — industrial air pressure
  const noise = createNoise(ac, 0.5)
  const noiseGain = ac.createGain()
  const noiseFilter = ac.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 250
  noiseFilter.Q.value = 1
  noiseGain.gain.setValueAtTime(0, now)
  noiseGain.gain.linearRampToValueAtTime(0.025, now + 0.05)
  noiseGain.gain.setValueAtTime(0.025, now + 0.2)
  noiseGain.gain.linearRampToValueAtTime(0, now + 0.5)

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ac.destination)
  noise.start(now)
  noise.stop(now + 0.55)
}

function cleanup() {
  humOsc?.stop()
  humLfo?.stop()
  hum2?.stop()
  ctx?.close()
  ctx = null
  initialized = false
}

export function useAudio() {
  function init() {
    if (initialized) return
    initialized = true
    playStartup()
    setTimeout(startHum, 2500)
  }

  return { init, playHover, cleanup }
}
