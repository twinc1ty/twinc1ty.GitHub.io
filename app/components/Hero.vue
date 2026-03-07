<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import gsap from 'gsap'

type Dir = 'top' | 'right' | 'bottom' | 'left'

const { playHover, cleanup: cleanupAudio } = useAudio()

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

const intensity = reactive<Record<Dir, number>>({ top: 0, right: 0, bottom: 0, left: 0 })

function onMouseMove(e: MouseEvent) {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const power = Math.min(1, dist / 300)
  const angle = Math.atan2(dy, dx)

  for (const item of menuItems) {
    intensity[item.position] = Math.max(0, Math.cos(angle - item.angle)) * power
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)

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
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  cleanupAudio()
})

function getItemStyle(pos: Dir) {
  const val = intensity[pos]
  return {
    opacity: 0.18 + val * 0.82,
    textShadow: val > 0.25
      ? `0 0 ${val * 40}px rgba(130, 190, 255, ${val * 0.6})`
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
  >
    <!-- 3D sphere -->
    <ClientOnly>
      <ThreeScene />
    </ClientOnly>

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
    </div>

    <!-- Cardinal menu items -->
    <NuxtLink
      v-for="(item, i) in menuItems"
      :key="item.position"
      :ref="(el: any) => setItemRef(el, i)"
      :to="item.href"
      class="echo-item"
      :class="`echo-${item.position}`"
      :style="getItemStyle(item.position)"
      @mouseenter="playHover"
    >
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
  color: #7aa2f7;
  text-transform: lowercase;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.12s ease, text-shadow 0.3s ease, letter-spacing 0.4s ease;
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
</style>
