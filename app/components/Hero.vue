<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import gsap from 'gsap'

type Dir = 'top' | 'right' | 'bottom' | 'left'

const { playHover, cleanup: cleanupAudio } = useAudio()
const { nx, ny, isMobile, gyroAvailable, init: initInput, requestGyroPermission, cleanup: cleanupInput } = useInputDirection()

const menuItems = [
  { label: '/identity', href: '/about', position: 'top' as Dir, angle: -Math.PI / 2 },
  { label: '/constructs', href: '/projects', position: 'right' as Dir, angle: 0 },
  { label: '/logs', href: '/blog', position: 'bottom' as Dir, angle: Math.PI / 2 },
  { label: '/signal', href: '/contact', position: 'left' as Dir, angle: Math.PI },
]

const heroRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
const taglineRef = ref<HTMLElement>()
const lineRef = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])
const pulseRingRef = ref<SVGElement>()
const tiltHintRef = ref<HTMLElement>()

const intensity = reactive<Record<Dir, number>>({ top: 0, right: 0, bottom: 0, left: 0 })
const pulseBoost = ref(0)
const edgeGlowActive = reactive<Record<Dir, boolean>>({ top: false, right: false, bottom: false, left: false })
const tiltHintDismissed = ref(false)

function playEdgeGlow(itemIndex: number) {
  const item = itemRefs.value[itemIndex]
  if (!item) return
  const pos = menuItems[itemIndex]!.position
  if (edgeGlowActive[pos]) return
  edgeGlowActive[pos] = true

  const el = (item as any).$el || item
  const edges = el.querySelectorAll('.edge')
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--cyber-accent-rgb').trim()
  const glow = { boxShadow: `0 0 4px 1px rgba(${rgb}, 1), 0 0 12px 3px rgba(${rgb}, 0.8), 0 0 30px 6px rgba(${rgb}, 0.3)` }
  const off = { opacity: 0, boxShadow: '0 0 0 0 transparent' }

  const tl = gsap.timeline({
    onComplete: () => { edgeGlowActive[pos] = false },
  })
  edges.forEach((edge: Element, e: number) => {
    tl.to(edge, { opacity: 1, ...glow, duration: 0.3, ease: 'power2.in' }, e * 0.15)
      .to(edge, { ...off, duration: 0.5, ease: 'power2.out' }, e * 0.15 + 0.3)
  })
}

function onItemHover(index: number) {
  playHover()
  if (!isMobile.value) {
    playEdgeGlow(index)
  }
}

function updateIntensity() {
  const dx = nx.value - 0.5
  const dy = ny.value - 0.5
  const dist = Math.sqrt(dx * dx + dy * dy)
  const power = Math.min(1, dist / 0.3)
  const angle = Math.atan2(dy, dx)

  for (const item of menuItems) {
    intensity[item.position] = Math.max(0, Math.cos(angle - item.angle)) * power
  }
}

let intensityRaf = 0
function intensityLoop() {
  updateIntensity()

  if (isMobile.value) {
    // Dismiss hint once real tilt is detected
    if (!tiltHintDismissed.value && gyroAvailable.value) {
      const total = intensity.top + intensity.right + intensity.bottom + intensity.left
      if (total > 0.15) {
        tiltHintDismissed.value = true
        if (tiltHintRef.value) {
          gsap.to(tiltHintRef.value, { opacity: 0, y: 6, duration: 0.4, ease: 'power2.in' })
        }
      }
    }

    menuItems.forEach((item, i) => {
      if (intensity[item.position] > 0.7) {
        playEdgeGlow(i)
      }
    })
  }

  intensityRaf = requestAnimationFrame(intensityLoop)
}

let pulseTimeout: ReturnType<typeof setTimeout> | null = null

function onTapPulse(e: MouseEvent | TouchEvent) {
  let clientX: number, clientY: number
  if ('touches' in e && e.touches.length) {
    clientX = e.touches[0]!.clientX
    clientY = e.touches[0]!.clientY
  }
  else if ('clientX' in e) {
    clientX = e.clientX
    clientY = e.clientY
  }
  else {
    return
  }

  if (pulseRingRef.value) {
    const rect = heroRef.value!.getBoundingClientRect()
    pulseRingRef.value.style.left = `${clientX - rect.left - 100}px`
    pulseRingRef.value.style.top = `${clientY - rect.top - 100}px`
  }

  if (isMobile.value && !gyroAvailable.value) {
    requestGyroPermission()
  }

  playHover()

  gsap.fromTo(pulseBoost, { value: 0 }, {
    value: 1,
    duration: 0.4,
    ease: 'power2.out',
  })

  const items = itemRefs.value
  if (items.length) {
    gsap.fromTo(items, {
      scale: 0.85,
      filter: 'blur(4px)',
    }, {
      scale: 1,
      filter: 'blur(0px)',
      stagger: 0.08,
      duration: 0.5,
      ease: 'back.out(1.7)',
    })
  }

  if (pulseRingRef.value) {
    gsap.fromTo(pulseRingRef.value, {
      scale: 0.2,
      opacity: 0.7,
    }, {
      scale: 3,
      opacity: 0,
      duration: 1.8,
      ease: 'power2.out',
    })
  }

  if (pulseTimeout) clearTimeout(pulseTimeout)
  pulseTimeout = setTimeout(() => {
    gsap.to(pulseBoost, {
      value: 0,
      duration: 2.5,
      ease: 'power1.inOut',
    })
  }, 2500)
}

onMounted(() => {
  initInput()
  intensityLoop()

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

  tl.from(heroRef.value!, {
    scale: 1.1,
    filter: 'blur(10px)',
    duration: 1.2,
    ease: 'power2.out',
  })
    .from(lineRef.value!, {
      scaleX: 0,
      duration: 0.8,
      ease: 'power4.inOut',
    }, 0.4)
    .from(nameRef.value!, {
      opacity: 0,
      y: 60,
      skewY: 5,
      filter: 'blur(12px)',
      duration: 1,
    }, 0.5)
    .from(taglineRef.value!, {
      opacity: 0,
      y: 30,
      letterSpacing: '0.5em',
      duration: 0.8,
    }, 0.9)
    .from(itemRefs.value, {
      opacity: 0,
      filter: 'blur(8px)',
      stagger: 0.1,
      duration: 0.6,
    }, 1.2)

  const introSequence = [0, 1, 2, 3, 0]
  const introDelay = tl.duration() - 0.2
  introSequence.forEach((itemIndex, i) => {
    setTimeout(() => playEdgeGlow(itemIndex), (introDelay + i * 1) * 1000)
  })

  // Tilt hint: fade in after intro, then run a repeating attention animation
  if (isMobile.value && tiltHintRef.value) {
    gsap.set(tiltHintRef.value, { opacity: 0, y: 8 })
    gsap.to(tiltHintRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      delay: tl.duration() + 0.5,
    })
    // Every 4 s: briefly brighten + device icon rocks to demand attention
    gsap.to(tiltHintRef.value, {
      opacity: 0.9,
      scale: 1.06,
      duration: 0.35,
      ease: 'power2.inOut',
      delay: tl.duration() + 3,
      repeat: -1,
      repeatDelay: 4,
      yoyo: true,
    })
  }
})

onUnmounted(() => {
  cancelAnimationFrame(intensityRaf)
  if (pulseTimeout) clearTimeout(pulseTimeout)
  cleanupInput()
  cleanupAudio()
})

function getItemStyle(pos: Dir) {
  const val = intensity[pos]
  const mobile = isMobile.value
  const baseOpacity = mobile ? 0.55 : 0.42
  const boost = mobile ? pulseBoost.value * 0.55 : 0
  const effectiveOpacity = Math.min(1, baseOpacity + val * (1 - baseOpacity) + boost)

  const glowVal = Math.max(val, pulseBoost.value * 0.5)
  return {
    opacity: effectiveOpacity,
    textShadow: glowVal > 0.25
      ? `0 0 ${glowVal * 40}px rgba(var(--cyber-accent-rgb), ${glowVal * 0.6})`
      : 'none',
    letterSpacing: `${0.12 + val * 0.06}em`,
  }
}

function setItemRef(el: any, i: number) {
  if (el) itemRefs.value[i] = el
}
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
    @click="onTapPulse"
  >
    <!-- Vector heart 3D scene -->
    <div class="absolute inset-0 z-0">
      <ClientOnly>
        <VectorHeartScene :pulse-intensity="pulseBoost" />
      </ClientOnly>
    </div>

    <!-- Radial vignette: darkens center so text stays legible -->
    <div class="absolute inset-0 z-1 pointer-events-none" style="background: radial-gradient(ellipse 48% 52% at 50% 50%, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.45) 55%, transparent 100%)" />

    <!-- Geometric pulse ring — expanding diamond -->
    <svg
      ref="pulseRingRef"
      class="pulse-heart-ring"
      viewBox="0 0 100 100"
      fill="none"
      width="220"
      height="220"
    >
      <path
        d="M50 4 L96 50 L50 96 L4 50Z"
        stroke="rgba(var(--cyber-accent-rgb), 0.35)"
        stroke-width="1.5"
      />
      <path
        d="M50 18 L82 50 L50 82 L18 50Z"
        stroke="rgba(var(--cyber-accent-rgb), 0.18)"
        stroke-width="1"
      />
    </svg>

    <!-- Hero text -->
    <div class="relative z-10 text-center px-6">
      <div ref="lineRef" class="w-16 h-px bg-cyber-accent/40 mx-auto mb-6 origin-left" />

      <h1
        ref="nameRef"
        class="text-2xl md:text-3xl font-display font-black mb-4 glitch tracking-widest uppercase"
        data-text="twinc1ty"
      >
        <span class="neon-text">twinc1ty</span>
      </h1>

      <p
        ref="taglineRef"
        class="text-sm md:text-base text-cyber-muted font-mono max-w-md mx-auto uppercase"
      >
        Engineering, Art & Literature
      </p>

      <!-- Mobile tilt hint — hidden once user tilts -->
      <div
        v-if="isMobile && !tiltHintDismissed"
        ref="tiltHintRef"
        class="mt-7 flex flex-col items-center gap-2"
      >
        <!-- Animated device icon -->
        <svg
          v-if="gyroAvailable"
          class="tilt-device"
          viewBox="0 0 40 64"
          width="22"
          height="35"
          fill="none"
        >
          <!-- Phone body -->
          <rect x="4" y="2" width="32" height="60" rx="5" stroke="var(--cyber-accent)" stroke-width="2" stroke-opacity="0.6" />
          <!-- Screen -->
          <rect x="8" y="8" width="24" height="44" rx="2" stroke="var(--cyber-accent)" stroke-width="1" stroke-opacity="0.3" />
          <!-- Home indicator -->
          <line x1="15" y1="56" x2="25" y2="56" stroke="var(--cyber-accent)" stroke-width="2" stroke-opacity="0.5" stroke-linecap="round" />
          <!-- Tilt arrows -->
          <path d="M0 28 L-6 22 M0 28 L-6 34" stroke="var(--cyber-accent)" stroke-width="1.5" stroke-opacity="0.5" stroke-linecap="round" transform="translate(2,0)" />
          <path d="M40 28 L46 22 M40 28 L46 34" stroke="var(--cyber-accent)" stroke-width="1.5" stroke-opacity="0.5" stroke-linecap="round" transform="translate(-2,0)" />
        </svg>

        <!-- Tap icon for non-gyro -->
        <svg
          v-else
          class="tap-hint-icon"
          viewBox="0 0 40 40"
          width="24"
          height="24"
          fill="none"
        >
          <circle cx="20" cy="20" r="16" stroke="var(--cyber-accent)" stroke-width="1.5" stroke-opacity="0.5" />
          <circle cx="20" cy="20" r="5" fill="var(--cyber-accent)" fill-opacity="0.4" />
        </svg>

        <span class="text-[9px] font-mono tracking-[0.35em] uppercase" style="color: rgba(var(--cyber-accent-rgb), 0.65)">
          {{ gyroAvailable ? 'tilt to explore' : 'tap to reveal' }}
        </span>
      </div>
    </div>

    <!-- Cardinal menu items -->
    <NuxtLink
      v-for="(item, i) in menuItems"
      :key="item.position"
      :ref="(el: any) => setItemRef(el, i)"
      :to="item.href"
      class="echo-item"
      :class="`echo-${item.position}`"
      :style="{ ...getItemStyle(item.position), '--item-index': i }"
      @mouseenter="onItemHover(i)"
      @click.stop
    >
      <span class="edge edge-top" />
      <span class="edge edge-right" />
      <span class="edge edge-bottom" />
      <span class="edge edge-left" />
      {{ item.label }}
    </NuxtLink>

    <!-- Version tag -->
    <span class="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyber-muted tracking-[0.4em] uppercase z-10">
      twinc1ty.sys v2.0
    </span>
  </section>
</template>

<style>
.echo-item {
  position: absolute;
  z-index: 20;
  font-family: 'Space Mono', monospace;
  font-size: clamp(0.85rem, 2.5vw, 1.6rem);
  color: var(--cyber-accent);
  text-transform: lowercase;
  text-decoration: none;
  white-space: nowrap;
  padding: 0.35em 0.75em;
  transition: opacity 0.12s ease, text-shadow 0.3s ease, letter-spacing 0.4s ease;
}

/* ── Neon border edges ── */
.edge {
  position: absolute;
  background: var(--cyber-accent);
  opacity: 0;
  pointer-events: none;
}

.edge-top    { top: 0; left: 0; right: 0; height: 2px; }
.edge-right  { top: 0; right: 0; bottom: 0; width: 2px; }
.edge-bottom { bottom: 0; left: 0; right: 0; height: 2px; }
.edge-left   { top: 0; left: 0; bottom: 0; width: 2px; }

/* Desktop: cardinal */
.echo-top    { top: 16%; left: 50%; transform: translateX(-50%); }
.echo-right  { top: 50%; right: 8%; transform: translateY(-50%); }
.echo-bottom { bottom: 16%; left: 50%; transform: translateX(-50%); }
.echo-left   { top: 50%; left: 8%; transform: translateY(-50%); }

/* Mobile: corners */
@media (max-width: 768px) {
  .echo-item   { font-size: 0.8rem; }
  .echo-top    { top: 12%; left: 50%; transform: translateX(-50%); }
  .echo-right  { top: auto; bottom: 22%; right: 6%; transform: none; }
  .echo-bottom { bottom: 12%; left: 50%; transform: translateX(-50%); }
  .echo-left   { top: auto; bottom: 22%; left: 6%; transform: none; }
}

/* Tilt device icon — rocks left/right to demonstrate the gesture */
.tilt-device {
  animation: tilt-rock 2.8s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes tilt-rock {
  0%, 100% { transform: rotate(0deg); }
  20%       { transform: rotate(-18deg); }
  50%       { transform: rotate(0deg); }
  70%       { transform: rotate(18deg); }
  90%       { transform: rotate(0deg); }
}

/* Tap hint ripple */
.tap-hint-icon {
  animation: tap-pulse 2.2s ease-in-out infinite;
}

@keyframes tap-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.15); }
}

/* Geometric pulse ring */
.pulse-heart-ring {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  will-change: transform, opacity;
  transform-origin: center center;
}
</style>
