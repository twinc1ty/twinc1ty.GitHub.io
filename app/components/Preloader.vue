<script setup lang="ts">
import gsap from 'gsap'

const visible = ref(true)
const preloaderRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const lettersRef = ref<HTMLElement>()
const lineRef = ref<HTMLElement>()
const counterRef = ref<HTMLElement>()

const progress = ref(0)
const readyToDismiss = ref(false)
const enterRef = ref<HTMLElement>()

const { init: initAudio } = useAudio()

// preloader made by claude mostly
onMounted(() => {
  const start = performance.now()
  const minVisible = 1800

  // Entrance animation
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

  // Letters stagger in with glitch
  tl.from(lettersRef.value!.children, {
    opacity: 0,
    y: 40,
    rotateX: -90,
    stagger: 0.06,
    duration: 0.8,
  })
  // Line draws from center
  .from(lineRef.value!, {
    scaleX: 0,
    duration: 0.6,
    ease: 'power2.inOut',
  }, 0.3)
  // Counter ticks up
  .to(progress, {
    value: 100,
    duration: 1.4,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (counterRef.value) {
        counterRef.value.textContent = `${Math.round(progress.value)}%`
      }
    },
  }, 0.2)

  // Wait for fonts + minimum time, then show "click to enter"
  const ready = document.fonts ? document.fonts.ready : Promise.resolve()
  ready.then(() => {
    const elapsed = performance.now() - start
    const remaining = Math.max(0, minVisible - elapsed)
    setTimeout(() => {
      readyToDismiss.value = true
      if (counterRef.value) counterRef.value.style.display = 'none'
      nextTick(() => {
        if (enterRef.value) {
          gsap.fromTo(enterRef.value, { opacity: 0 }, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
      })
    }, remaining)
  })
})

function onEnterClick() {
  if (!readyToDismiss.value) return
  initAudio()
  dismiss()
}

function dismiss() {
  if (!preloaderRef.value || !contentRef.value) return

  const tl = gsap.timeline({
    onComplete: () => { visible.value = false },
  })

  // Content fades and scales
  tl.to(contentRef.value, {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)',
    duration: 0.4,
    ease: 'power3.in',
  })
  // Split wipe - two halves slide apart
  .to('.preloader-top', {
    yPercent: -100,
    duration: 0.8,
    ease: 'power4.inOut',
  }, 0.3)
  .to('.preloader-bottom', {
    yPercent: 100,
    duration: 0.8,
    ease: 'power4.inOut',
  }, 0.3)
}
</script>

<template>
  <div v-if="visible" ref="preloaderRef" class="fixed inset-0 z-[9999]" @click="onEnterClick">
    <!-- Split panels -->
    <div class="preloader-top absolute inset-x-0 top-0 h-1/2 bg-cyber-dark" />
    <div class="preloader-bottom absolute inset-x-0 bottom-0 h-1/2 bg-cyber-dark" />

    <!-- Content overlay -->
    <div ref="contentRef" class="absolute inset-0 flex items-center justify-center z-10">
      <div class="text-center">
        <!-- Letters -->
        <div
          ref="lettersRef"
          class="flex items-center justify-center gap-[0.08em] text-3xl md:text-5xl font-display font-black tracking-[0.3em] uppercase text-white"
          style="perspective: 600px"
        >
          <span v-for="(letter, i) in 'twinc1ty'.split('')" :key="i" class="inline-block">
            {{ letter }}
          </span>
        </div>

        <!-- Animated line -->
        <div ref="lineRef" class="w-24 h-px bg-gradient-to-r from-transparent via-cyber-accent to-transparent mx-auto mt-5 origin-center" />

        <!-- Progress counter -->
        <p ref="counterRef" class="font-mono text-xs text-cyber-muted mt-4 tracking-[0.5em]">
          0%
        </p>

        <!-- Click to enter -->
        <p
          v-if="readyToDismiss"
          ref="enterRef"
          class="font-mono text-[10px] text-cyber-accent/60 mt-6 tracking-[0.4em] uppercase cursor-pointer animate-pulse"
        >
          [ click to enter ]
        </p>
      </div>
    </div>
  </div>
</template>
