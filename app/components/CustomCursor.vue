<script setup lang="ts">
const outerRef = ref<HTMLElement>()
const dotRef = ref<HTMLElement>()
const cursorVisible = ref(false)

let mouseX = 0
let mouseY = 0
let outerX = 0
let outerY = 0
let rafId = 0

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

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  cursorVisible.value = true

  if (dotRef.value) {
    dotRef.value.style.left = `${mouseX - 2}px`
    dotRef.value.style.top = `${mouseY - 2}px`
  }
}

function startFollowLoop() {
  function tick() {
    outerX += (mouseX - outerX) * 0.12
    outerY += (mouseY - outerY) * 0.12

    if (outerRef.value) {
      outerRef.value.style.left = `${outerX - 14}px`
      outerRef.value.style.top = `${outerY - 14}px`
    }

    rafId = requestAnimationFrame(tick)
  }
  tick()
}

function onMouseDown() {
  outerRef.value?.classList.add('cursor-active')
}

function onMouseUp() {
  outerRef.value?.classList.remove('cursor-active')
}
</script>

<template>
  <div v-if="cursorVisible">
    <!-- Fine crosshair cursor -->
    <div ref="outerRef" class="cursor-outer">
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none" style="display:block">
        <!-- Horizontal arms with center gap -->
        <line x1="0" y1="14" x2="10" y2="14" stroke="rgba(var(--cyber-accent-rgb), 0.7)" stroke-width="1" />
        <line x1="18" y1="14" x2="28" y2="14" stroke="rgba(var(--cyber-accent-rgb), 0.7)" stroke-width="1" />
        <!-- Vertical arms with center gap -->
        <line x1="14" y1="0" x2="14" y2="10" stroke="rgba(var(--cyber-accent-rgb), 0.7)" stroke-width="1" />
        <line x1="14" y1="18" x2="14" y2="28" stroke="rgba(var(--cyber-accent-rgb), 0.7)" stroke-width="1" />
        <!-- Corner ticks (Printstream-inspired precision marks) -->
        <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
        <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
        <line x1="28" y1="0" x2="24" y2="0" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
        <line x1="28" y1="0" x2="28" y2="4" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
        <line x1="0" y1="28" x2="4" y2="28" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
        <line x1="0" y1="28" x2="0" y2="24" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
        <line x1="28" y1="28" x2="24" y2="28" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
        <line x1="28" y1="28" x2="28" y2="24" stroke="rgba(var(--cyber-accent-rgb), 0.35)" stroke-width="1" />
      </svg>
    </div>
    <!-- Center dot -->
    <div ref="dotRef" class="cursor-dot" />
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
  pointer-events: none;
  z-index: 99998;
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.cursor-outer.cursor-active {
  transform: scale(0.75);
  opacity: 0.6;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 4px;
  height: 4px;
  background: var(--cyber-accent);
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
