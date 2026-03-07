<script setup lang="ts">
import gsap from 'gsap'

const outerRef = ref<HTMLElement>()
const dotRef = ref<HTMLElement>()
const cursorVisible = ref(false)

let mouseX = 0
let mouseY = 0
let outerX = 0
let outerY = 0
let hoveredCard: HTMLElement | null = null
let morphed = false
let rafId = 0

const MORPH_SELECTORS = '.cyber-folder, .contact-chip, .cyber-chip'

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseenter', () => { cursorVisible.value = true })
  window.addEventListener('mouseleave', () => { cursorVisible.value = false })
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mouseup', onMouseUp)
  startFollowLoop()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mouseup', onMouseUp)
  cancelAnimationFrame(rafId)
})

function findHoverCard(e: MouseEvent): HTMLElement | null {
  const target = e.target as HTMLElement
  return target.closest<HTMLElement>(MORPH_SELECTORS)
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  cursorVisible.value = true

  if (dotRef.value) {
    dotRef.value.style.left = `${mouseX - 2}px`
    dotRef.value.style.top = `${mouseY - 2}px`
  }

  const card = findHoverCard(e)

  if (card && card !== hoveredCard) {
    hoveredCard = card
    morphToCard(card)
  } else if (!card && hoveredCard) {
    hoveredCard = null
    morphToCircle()
  } else if (card && card === hoveredCard && morphed) {
    updateMorphPosition(card)
  }
}

function startFollowLoop() {
  function tick() {
    outerX += (mouseX - outerX) * 0.12
    outerY += (mouseY - outerY) * 0.12

    if (outerRef.value && !morphed) {
      outerRef.value.style.left = `${outerX - 20}px`
      outerRef.value.style.top = `${outerY - 20}px`
      // Reset any GSAP-set dimensions when in circle mode
      outerRef.value.style.width = '40px'
      outerRef.value.style.height = '40px'
      outerRef.value.style.borderRadius = '50%'
    }

    rafId = requestAnimationFrame(tick)
  }
  tick()
}

function morphToCard(card: HTMLElement) {
  morphed = true
  const el = outerRef.value!
  const rect = card.getBoundingClientRect()
  const pad = 8

  // Kill any ongoing GSAP tween on this element
  gsap.killTweensOf(el)

  gsap.to(el, {
    left: rect.left - pad,
    top: rect.top - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
    borderRadius: 0,
    borderColor: 'rgba(122, 162, 247, 0.6)',
    duration: 0.35,
    ease: 'power3.out',
  })
}

function updateMorphPosition(card: HTMLElement) {
  const el = outerRef.value
  if (!el) return
  const rect = card.getBoundingClientRect()
  const pad = 8

  // Direct style update for smooth tracking (no tween needed)
  el.style.left = `${rect.left - pad}px`
  el.style.top = `${rect.top - pad}px`
  el.style.width = `${rect.width + pad * 2}px`
  el.style.height = `${rect.height + pad * 2}px`
}

function morphToCircle() {
  morphed = false
  const el = outerRef.value!

  gsap.killTweensOf(el)

  // Snap lerp position to current outer position so there's no jump
  gsap.to(el, {
    left: outerX - 20,
    top: outerY - 20,
    width: 40,
    height: 40,
    borderRadius: '50%',
    borderColor: 'rgba(122, 162, 247, 0.5)',
    duration: 0.3,
    ease: 'power3.out',
    onComplete: () => {
      // After tween completes, the follow loop takes over again
    },
  })
}

function onMouseDown() {
  if (!morphed) {
    outerRef.value?.classList.add('cursor-active')
  }
}

function onMouseUp() {
  outerRef.value?.classList.remove('cursor-active')
}
</script>

<template>
  <div v-if="cursorVisible">
    <div
      ref="outerRef"
      class="cursor-outer"
    />
    <div
      ref="dotRef"
      class="cursor-dot"
    />
  </div>
</template>

<style>
/* Hide default cursor globally */
*, *::before, *::after {
  cursor: none !important;
}

.cursor-outer {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(122, 162, 247, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  mix-blend-mode: difference;
}

.cursor-outer.cursor-active {
  width: 30px;
  height: 30px;
  border-color: rgba(122, 162, 247, 0.8);
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
}

/* Restore cursor on touch devices */
@media (hover: none) and (pointer: coarse) {
  *, *::before, *::after {
    cursor: auto !important;
  }
}
</style>
