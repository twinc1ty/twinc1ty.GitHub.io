<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const route = useRoute()
const isHome = computed(() => route.path === '/')

const dockRef = ref<HTMLElement>()
const awayTop = ref<number | null>(null)
const awayLeft = ref<number | null>(null)

const GAP_ABOVE_FOOTER = 0
const GAP_FROM_RIGHT = 24

function footerHeightPx() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--footer-h')
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 45
}

function recalc() {
  if (!dockRef.value || isHome.value) return
  const rect = dockRef.value.getBoundingClientRect()
  awayTop.value = window.innerHeight - rect.height - footerHeightPx() - GAP_ABOVE_FOOTER
  awayLeft.value = window.innerWidth - rect.width - GAP_FROM_RIGHT
}

let ro: ResizeObserver | null = null

onMounted(() => {
  ro = new ResizeObserver(() => recalc())
  if (dockRef.value) ro.observe(dockRef.value)
  window.addEventListener('resize', recalc)
  nextTick(recalc)
})

watch(isHome, () => {
  nextTick(recalc)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('resize', recalc)
})

const style = computed(() => {
  if (isHome.value || awayTop.value === null || awayLeft.value === null) return {}
  return {
    top: `${awayTop.value}px`,
    left: `${awayLeft.value}px`,
    transform: 'translate(0, 0)',
  }
})
</script>

<template>
  <div ref="dockRef" class="knob-dock" :class="isHome ? 'is-home' : 'is-away'" :style="style">
    <CircularKnobNav :compact="!isHome" />
  </div>
</template>

<style scoped>
.knob-dock {
  position: fixed;
  z-index: 70;
  transition: top 0.7s cubic-bezier(0.16, 1, 0.3, 1), left 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.knob-dock.is-home {
  top: 50%;
  left: 80%;
  transform: translate(-50%, -50%);
}

/* Fallback for the first paint before JS measures the exact position */
.knob-dock.is-away {
  top: calc(100vh - var(--footer-h) - 11rem);
  left: calc(100vw - 17rem);
}

@media (max-width: 900px) {
  .knob-dock.is-home {
    top: 63%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .knob-dock.is-away {
    top: calc(100vh - var(--footer-h) - 9.5rem);
    left: calc(100vw - 15rem);
  }
}

@media (max-width: 480px) {
  .knob-dock.is-away {
    left: 1rem !important;
  }
}
</style>
