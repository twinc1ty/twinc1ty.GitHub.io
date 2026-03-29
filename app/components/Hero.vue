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
const pulseRingRef = ref<HTMLElement>()

const intensity = reactive<Record<Dir, number>>({ top: 0, right: 0, bottom: 0, left: 0 })
const pulseBoost = ref(0) // 0-1, driven by tap-to-pulse on mobile
const edgeGlowActive = reactive<Record<Dir, boolean>>({ top: false, right: false, bottom: false, left: false })

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
  const power = Math.min(1, dist / 0.3) // 0.3 in normalized space is 300px equivalent
  const angle = Math.atan2(dy, dx)

  for (const item of menuItems) {
    intensity[item.position] = Math.max(0, Math.cos(angle - item.angle)) * power
  }
}

let intensityRaf = 0
function intensityLoop() {
  updateIntensity()

  // Mobile: trigger edge glow when tilting toward a menu item
  if (isMobile.value) {
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
  } else if ('clientX' in e) {
    clientX = e.clientX
    clientY = e.clientY
  } else {
    return
  }

  if (pulseRingRef.value) {
    const rect = heroRef.value!.getBoundingClientRect()
    pulseRingRef.value.style.left = `${clientX - rect.left}px`
    pulseRingRef.value.style.top = `${clientY - rect.top}px`
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
      scale: 0.3,
      opacity: 0.8,
    }, {
      scale: 2.5,
      opacity: 0,
      duration: 1.6,
      ease: 'power2.out',
    })
  }

  // Clear decay
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

  // Neon edge glow: each item's borders trace one by one after intro
  // Full circle: identity → constructs → logs → signal, then identity again
  const introSequence = [0, 1, 2, 3, 0]
  const introDelay = tl.duration() - 0.2
  introSequence.forEach((itemIndex, i) => {
    setTimeout(() => playEdgeGlow(itemIndex), (introDelay + i * 1) * 1000)
  })
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
  // Mobile: higher base opacity (0.45), pulse boost adds more
  const baseOpacity = mobile ? 0.45 : 0.18
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
    <!-- 3D sphere -->
    <div class="absolute inset-0 z-0">
      <ClientOnly>
        <ThreeScene :pulse-intensity="pulseBoost" />
      </ClientOnly>
    </div>

    <!-- Pulse ring: soft radial gradient that expands outward on tap -->
    <div
      ref="pulseRingRef"
      class="pulse-ring"
    />

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

      <!-- Mobile hint -->
      <p
        v-if="isMobile"
        class="mt-6 text-[9px] font-mono text-cyber-muted/40 tracking-[0.3em] uppercase animate-pulse"
      >
        {{ gyroAvailable ? '[ tilt to explore ]' : '[ tap to reveal ]' }}
      </p>
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

.edge-top {
  top: 0; left: 0; right: 0; height: 2px;
}

.edge-right {
  top: 0; right: 0; bottom: 0; width: 2px;
}

.edge-bottom {
  bottom: 0; left: 0; right: 0; height: 2px;
}

.edge-left {
  top: 0; left: 0; bottom: 0; width: 2px;
}

/* Desktop: cardinal directions */
.echo-top {
  top: 16%;
  left: 50%;
  transform: translateX(-50%);
}

.echo-right {
  top: 50%;
  right: 8%;
  transform: translateY(-50%);
}

.echo-bottom {
  bottom: 16%;
  left: 50%;
  transform: translateX(-50%);
}

.echo-left {
  top: 50%;
  left: 8%;
  transform: translateY(-50%);
}

/* Mobile: shift to corners to avoid overlapping hero text */
@media (max-width: 768px) {
  .echo-item {
    font-size: 0.8rem;
  }

  .echo-top {
    top: 12%;
    left: 50%;
    transform: translateX(-50%);
  }

  .echo-right {
    top: auto;
    bottom: 22%;
    right: 6%;
    transform: none;
  }

  .echo-bottom {
    bottom: 12%;
    left: 50%;
    transform: translateX(-50%);
  }

  .echo-left {
    top: auto;
    bottom: 22%;
    left: 6%;
    transform: none;
  }
}

/* Soft radial gradient pulse ring */
.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    transparent 30%,
    rgba(var(--cyber-accent-rgb), 0.25) 50%,
    rgba(var(--cyber-accent-rgb), 0.12) 65%,
    transparent 85%
  );
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  will-change: transform, opacity;
}
</style>
