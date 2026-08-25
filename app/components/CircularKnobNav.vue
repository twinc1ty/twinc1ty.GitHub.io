<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface KnobItem {
  label: string
  short: string
  to: string
}

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const items: KnobItem[] = [
  { label: 'home', short: 'Home', to: '/' },
  { label: 'identity', short: 'About', to: '/about' },
  { label: 'constructs', short: 'Work', to: '/projects' },
  { label: 'logs', short: 'Blog', to: '/blog' },
  { label: 'signal', short: 'Contact', to: '/contact' },
]

const SEGMENT = 360 / items.length

const rotation = ref(0)
const spinning = ref(false)

let ac: AudioContext | null = null
function playClick() {
  if (typeof window === 'undefined') return
  if (!ac) ac = new AudioContext()
  if (ac.state === 'suspended') ac.resume()
  const now = ac.currentTime

  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(1900, now)
  gain.gain.setValueAtTime(0.14, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(now)
  osc.stop(now + 0.05)

  const bufferSize = ac.sampleRate * 0.02
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const noise = ac.createBufferSource()
  noise.buffer = buffer
  const noiseFilter = ac.createBiquadFilter()
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.value = 3000
  const noiseGain = ac.createGain()
  noiseGain.gain.setValueAtTime(0.09, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ac.destination)
  noise.start(now)
}

function normDeg(a: number) {
  return ((a % 360) + 360) % 360
}

function deltaDeg(a: number, b: number) {
  let d = normDeg(b - a)
  if (d > 180) d -= 360
  return d
}

function detentIndex(deg: number) {
  const n = items.length
  return ((Math.round(deg / SEGMENT) % n) + n) % n
}

const activeIndex = computed(() => detentIndex(rotation.value))

// Keep the dial pointed at whatever page we're actually on — browser
// back/forward, deep links, or any navigation that didn't go through
// a click on the dial itself.
const route = useRoute()
function routeIndex(path: string) {
  const idx = items.findIndex(it => path === it.to || (it.to !== '/' && path.startsWith(`${it.to}/`)))
  return idx === -1 ? 0 : idx
}
watch(() => route.path, (path) => {
  const idx = routeIndex(path)
  if (idx !== activeIndex.value) {
    rotation.value += deltaDeg(normDeg(rotation.value), idx * SEGMENT)
  }
}, { immediate: true })

let pendingNav: ReturnType<typeof setTimeout> | null = null

function onDialClick() {
  spinning.value = true
  rotation.value += SEGMENT
  playClick()
  settleNavigate()
}

function settleNavigate() {
  if (pendingNav) clearTimeout(pendingNav)
  const item = items[activeIndex.value]!
  pendingNav = setTimeout(() => {
    pendingNav = null
    navigateTo(item.to)
  }, 280)
}

onBeforeUnmount(() => {
  if (pendingNav) clearTimeout(pendingNav)
  ac?.close()
})
</script>

<template>
  <div class="knob-plate" :class="{ 'is-compact': compact }">
    <div class="knob-plate__screw tl" />
    <div class="knob-plate__screw tr" />
    <div class="knob-plate__screw bl" />
    <div class="knob-plate__screw br" />

    <span class="knob-plate__caption">Nav · Ch.01</span>

    <div class="knob-nav">
      <div class="knob-nav__dial-wrap">
        <div class="knob-nav__bezel" />
        <button
          type="button"
          class="knob-nav__dial"
          aria-label="Rotate to next section"
          @click="onDialClick"
        >
          <span class="knob-nav__ring">
            <span class="knob-nav__ring2">
              <span class="knob-nav__cap" />
            </span>
          </span>
          <span class="knob-nav__face" :style="{ transform: `rotate(${rotation}deg)` }">
            <span class="knob-nav__notch" />
          </span>
        </button>
      </div>

      <div class="knob-nav__readout">
        <div class="knob-nav__window">
          <span class="knob-nav__window-index">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
          <Transition name="window-swap" mode="out-in">
            <span :key="activeIndex" class="knob-nav__window-text">{{ items[activeIndex]!.short }}</span>
          </Transition>
        </div>
      </div>
    </div>

    <div class="knob-plate__divider" />
    <NowPlaying :compact="compact" />
  </div>
</template>

<style scoped>
.knob-plate {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.1rem 1.4rem 1rem 1.1rem;
  background: #fafaf7;
  border: 1.5px solid #0b0a0e;
  user-select: none;
  -webkit-user-select: none;
}

.knob-plate__divider {
  height: 1px;
  background: #e1daf5;
  margin: 0 -0.2rem;
}

.knob-plate__screw {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background: #0b0a0e;
  opacity: 0.3;
}

.knob-plate__screw.tl { top: 6px; left: 6px; }
.knob-plate__screw.tr { top: 6px; right: 6px; }
.knob-plate__screw.bl { bottom: 6px; left: 6px; }
.knob-plate__screw.br { bottom: 6px; right: 6px; }

.knob-plate__caption {
  position: absolute;
  top: 6px;
  left: 16px;
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 8px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #5b21e0;
  opacity: 0.7;
}

.knob-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.knob-nav__dial-wrap {
  position: relative;
  width: 132px;
  height: 132px;
  flex-shrink: 0;
}

.knob-plate.is-compact .knob-nav__dial-wrap {
  width: 84px;
  height: 84px;
}

.knob-nav__bezel {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background:
    repeating-conic-gradient(
      from 0deg,
      #b9a8f0 0deg 1.1deg,
      transparent 1.1deg 15deg
    );
}

.knob-nav__dial {
  position: absolute;
  inset: 12px;
  border-radius: 9999px;
  background: #0b0a0e;
  cursor: pointer;
  border: none;
  padding: 0;
  display: block;
  user-select: none;
}

.knob-nav__ring {
  position: absolute;
  inset: 9%;
  border-radius: 9999px;
  background: #1a1622;
  display: block;
}

.knob-nav__ring2 {
  position: absolute;
  inset: 12%;
  border-radius: 9999px;
  background: #241e30;
  display: block;
}

.knob-nav__cap {
  position: absolute;
  inset: 14%;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 45%),
    #2e2740;
  display: block;
}

.knob-nav__dial::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgba(250, 250, 247, 0.14);
  pointer-events: none;
}

.knob-nav__face {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  display: block;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.knob-nav__notch {
  position: absolute;
  top: 7px;
  left: 50%;
  width: 0;
  height: 0;
  margin-left: -5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 9px solid #5b21e0;
}

.knob-nav__readout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.knob-nav__window {
  min-width: 8.5rem;
  padding: 0.7rem 0.95rem;
  background: #fafaf7;
  border: 2px solid #0b0a0e;
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  overflow: hidden;
}

.knob-plate.is-compact .knob-nav__window {
  min-width: 7rem;
  padding: 0.55rem 0.75rem;
}

.knob-nav__window-index {
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 0.7rem;
  color: #5b21e0;
  flex-shrink: 0;
}

.knob-nav__window-text {
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0b0a0e;
}

.knob-plate.is-compact .knob-nav__window-text {
  font-size: 0.92rem;
}

.knob-plate.is-compact .knob-nav__window-index {
  font-size: 0.65rem;
}


.window-swap-enter-active,
.window-swap-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.window-swap-enter-from {
  opacity: 0;
  transform: translateY(60%);
}

.window-swap-leave-to {
  opacity: 0;
  transform: translateY(-60%);
}
</style>
