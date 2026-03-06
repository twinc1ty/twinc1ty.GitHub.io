<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const heroRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
const taglineRef = ref<HTMLElement>()
const lineRef = ref<HTMLElement>()

onMounted(() => {
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
})
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <ClientOnly>
      <ThreeScene />
    </ClientOnly>

    <div class="relative z-10 text-center px-6">
      <div ref="lineRef" class="w-16 h-px bg-cyber-accent/40 mx-auto mb-6 origin-left" />

      <h1
        ref="nameRef"
        class="text-5xl md:text-8xl font-display font-black mb-4 glitch tracking-widest uppercase"
        data-text="twinc1ty"
      >
        <span class="neon-text">twinc1ty</span>
      </h1>

      <p
        ref="taglineRef"
        class="text-sm md:text-base text-cyber-muted font-mono max-w-md mx-auto uppercase"
      >
        Engineering. System Design. Literature.
      </p>
    </div>
  </section>
</template>
