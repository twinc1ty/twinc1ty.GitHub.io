<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const eyebrowRef = ref<HTMLElement>()
const line1Ref = ref<HTMLElement>()
const line2Ref = ref<HTMLElement>()
const subRef = ref<HTMLElement>()
const hintRef = ref<HTMLElement>()
const blockRef = ref<HTMLElement>()
const statusRef = ref<HTMLElement>()

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from(blockRef.value!, {
    scaleY: 0,
    duration: 0.7,
    ease: 'power4.inOut',
    transformOrigin: 'bottom',
  })
    .from(eyebrowRef.value!, { opacity: 0, y: 16, duration: 0.5 }, 0.3)
    .from(line1Ref.value!, { opacity: 0, y: 36, duration: 0.65 }, 0.42)
    .from(line2Ref.value!, { opacity: 0, y: 36, duration: 0.65 }, 0.52)
    .from(subRef.value!, { opacity: 0, y: 20, duration: 0.5 }, 0.68)
    .from(hintRef.value!, { opacity: 0, duration: 0.4 }, 0.85)
    .from(statusRef.value!, { opacity: 0, y: 12, duration: 0.45, clearProps: 'all' }, 0.95)
})
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero__bg-type" aria-hidden="true">twinc1ty</div>

    <div class="hero__grid grid grid-cols-1 min-[900px]:grid-cols-[1.4fr_1fr] gap-16 items-center max-w-[78rem] w-full mx-auto">
      <div class="hero__copy">
        <div ref="blockRef" class="hero__block" />

        <p ref="eyebrowRef" class="hero__eyebrow">
          <span class="hero__eyebrow-mark">twinc1ty</span> — Computer Science Engineer, Senior SDE
        </p>

        <h1 class="hero__name">
          <span ref="line1Ref" class="hero__line hero__line--ink">Anirudh</span>
          <span ref="line2Ref" class="hero__line hero__line--violet">Rath</span>
        </h1>

        <p ref="subRef" class="hero__sub">
          Engineering, art, and literature — building things that hold up
          under pressure, and read well long after.
        </p>

        <p ref="hintRef" class="hero__hint">
          Turn the dial to explore →
        </p>

        <div ref="statusRef" class="hero__status">
          <span class="hero__status-dot" />
          Available for new work
        </div>
      </div>

      <!-- Reserved space — the site-wide knob (mounted in the layout) docks here on home -->
      <div class="hero__nav-spacer" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100vh - var(--footer-h));
  width: 100%;
  background: #fafaf7;
  color: #0b0a0e;
  display: flex;
  align-items: center;
  padding: 6rem 1.5rem;
  overflow: hidden;
}

@media (max-width: 640px) {
  .hero {
    min-height: calc(100vh - var(--footer-h) - var(--knob-bar-h));
  }
}

.hero__bg-type {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: clamp(6rem, 24vw, 22rem);
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(11, 10, 14, 0.05);
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
}

.hero__copy {
  position: relative;
}

.hero__block {
  position: absolute;
  top: -3.75rem;
  left: -1.25rem;
  width: 3.25rem;
  height: 3.25rem;
  background: #5b21e0;
  z-index: 0;
}


.hero__eyebrow {
  position: relative;
  z-index: 1;
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #8a84a0;
  margin-bottom: 1.25rem;
}

.hero__eyebrow-mark {
  color: #5b21e0;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.hero__name {
  position: relative;
  z-index: 1;
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: clamp(3.25rem, 9vw, 7.5rem);
  line-height: 0.92;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin: 0 0 1.75rem;
}

.hero__line {
  display: block;
}

.hero__line--ink {
  color: #0b0a0e;
}

.hero__line--violet {
  color: #5b21e0;
}

.hero__sub {
  position: relative;
  z-index: 1;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.55;
  color: #34313c;
  max-width: 30rem;
  margin-bottom: 2rem;
}

.hero__hint {
  position: relative;
  z-index: 1;
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8a84a0;
}

.hero__status {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.75rem;
  padding: 0.4rem 0.75rem;
  border: 1.5px solid #0b0a0e;
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0b0a0e;
}

.hero__status-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background: #5b21e0;
  animation: hero-status-pulse 1.8s ease-in-out infinite;
}

@keyframes hero-status-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.75); }
}

@media (prefers-reduced-motion: reduce) {
  .hero__status-dot {
    animation: none;
  }
}

.hero__nav-spacer {
  min-height: 1px;
}
</style>
