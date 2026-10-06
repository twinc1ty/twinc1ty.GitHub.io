<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const line1Ref = ref<HTMLElement>()
const line2Ref = ref<HTMLElement>()
const subRef = ref<HTMLElement>()
const hintRef = ref<HTMLElement>()
const statusRef = ref<HTMLElement>()

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from(line1Ref.value!, { opacity: 0, y: 36, duration: 0.65 })
    .from(line2Ref.value!, { opacity: 0, y: 36, duration: 0.65 }, 0.1)
    .from(subRef.value!, { opacity: 0, y: 20, duration: 0.5 }, 0.26)
    .from(hintRef.value!, { opacity: 0, duration: 0.4 }, 0.43)
    .from(statusRef.value!, { opacity: 0, y: 12, duration: 0.45, clearProps: 'all' }, 0.53)
})
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero__bg-type" aria-hidden="true">twinc1ty</div>

    <div
      class="hero__grid grid grid-cols-1 min-[900px]:grid-cols-[1.4fr_1fr] gap-16 items-center max-w-[78rem] w-full mx-auto">
      <div class="hero__copy">
        <h1 class="hero__name">
          <span ref="line1Ref" class="hero__line hero__line--ink">Anirudh</span>
          <span ref="line2Ref" class="hero__line hero__line--violet">Rath</span>
        </h1>

        <p ref="subRef" class="hero__sub">
          Engineering, art, and literature - building things that hold up
          under pressure and read well long after. <span class="hero__aside text-sm italic text-gray-600">(occasionally, they don't
            :p)</span>
        </p>

        <div ref="statusRef" class="hero__status">
          <span class="hero__status-dot" />
          Let's build something together!
        </div>
      </div>

      <!-- Reserved space — the site-wide knob (mounted in the layout) docks here on home -->
      <div class="hero__nav-spacer" aria-hidden="true" />
    </div>

    <p ref="hintRef" class="hero__hint">
      Turn the dial to explore →
    </p>
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

  /* Trim the hero down to its essentials on small screens — the aside
     joke and the "turn the dial" hint are nice-to-haves, not load-bearing,
     and the knob bar is already visible at the bottom so the hint is
     redundant there. */
  .hero__aside,
  .hero__hint {
    display: none;
  }

  .hero__sub {
    margin-bottom: 1.25rem;
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

/* Anchored to the same coordinate the knob docks at (see SiteKnobDock.vue)
   so this reads as a caption sitting just under the dial, not a stray
   line in the text column on the other side of the page. */
.hero__hint {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 80%;
  transform: translate(-50%, 7.75rem);
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8a84a0;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .hero__hint {
    left: 50%;
    top: 63%;
    transform: translate(-50%, 6.5rem);
  }
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

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.45;
    transform: scale(0.75);
  }
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
