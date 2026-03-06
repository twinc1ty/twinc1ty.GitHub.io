<script setup lang="ts">
const outerRef = ref<HTMLElement>()
const dotRef = ref<HTMLElement>()
const cursorVisible = ref(false)

let mouseX = 0
let mouseY = 0
let outerX = 0
let outerY = 0

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseenter', () => { cursorVisible.value = true })
  window.addEventListener('mouseleave', () => { cursorVisible.value = false })
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('mouseup', onMouseUp)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mouseup', onMouseUp)
})

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  cursorVisible.value = true

  // Dot follows instantly
  if (dotRef.value) {
    dotRef.value.style.transform = `translate(${mouseX - 2}px, ${mouseY - 2}px)`
  }
}

function onMouseDown() {
  outerRef.value?.classList.add('cursor-active')
}

function onMouseUp() {
  outerRef.value?.classList.remove('cursor-active')
}

function animate() {
  // Outer ring follows with delay (lerp)
  outerX += (mouseX - outerX) * 0.12
  outerY += (mouseY - outerY) * 0.12

  if (outerRef.value) {
    outerRef.value.style.transform = `translate(${outerX - 20}px, ${outerY - 20}px)`
  }

  requestAnimationFrame(animate)
}
</script>

<template>
  <div v-if="cursorVisible">
    <!-- Outer circle - delayed follow -->
    <div
      ref="outerRef"
      class="cursor-outer"
    />
    <!-- Center dot - instant -->
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
  transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
  mix-blend-mode: difference;
}

.cursor-outer.cursor-active {
  width: 30px;
  height: 30px;
  border-color: rgba(122, 162, 247, 0.8);
  margin-left: 5px;
  margin-top: 5px;
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
