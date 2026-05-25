<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLDivElement>()
const tweens: gsap.core.Tween[] = []

// Ornamental paths — baroque/Printstream style, no literal hearts
// Diamond with inner square
const DIAMOND_PATH = 'M50 4 L96 50 L50 96 L4 50Z M50 22 L78 50 L50 78 L22 50Z'
// 8-arm starburst
const STAR_PATH = 'M50 8 L53 44 L88 22 L65 50 L88 78 L53 56 L50 92 L47 56 L12 78 L35 50 L12 22 L47 44Z'
// Baroque cross with flared ends
const CROSS_PATH = 'M44 4 L44 44 L4 44 L4 56 L44 56 L44 96 L56 96 L56 56 L96 56 L96 44 L56 44 L56 4Z'
// Ornamental circle with tick marks
const CIRCLE_PATH = 'M50 6 A44 44 0 1 1 49.9 6 M50 2 L50 10 M50 90 L50 98 M2 50 L10 50 M90 50 L98 50 M15 15 L21 21 M79 79 L85 85 M85 15 L79 21 M21 79 L15 85'

type ElType = 'diamond' | 'star' | 'cross' | 'circle'

interface OrnElement {
  type: ElType
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
  delay: number
}

const elements = ref<OrnElement[]>([])

function spawnElements() {
  const items: OrnElement[] = []
  const counts: [ElType, number][] = [['diamond', 22], ['star', 20], ['cross', 14], ['circle', 16]]

  for (const [type, count] of counts) {
    for (let i = 0; i < count; i++) {
      items.push({
        type,
        x: Math.random() * 97,
        y: Math.random() * 97,
        size: 5 + Math.random() * 10,
        opacity: 0.035 + Math.random() * 0.045,
        rotation: Math.random() * 360,
        delay: Math.random() * 10,
      })
    }
  }
  elements.value = items.sort(() => Math.random() - 0.5)
}

onMounted(() => {
  spawnElements()
  nextTick(() => {
    const els = containerRef.value?.querySelectorAll('.orn-el')
    if (!els) return
    els.forEach((el, i) => {
      const item = elements.value[i]
      if (!item) return
      tweens.push(gsap.to(el, {
        y: `${-28 - Math.random() * 38}`,
        x: `${(Math.random() - 0.5) * 20}`,
        rotation: item.rotation + (Math.random() - 0.5) * 50,
        duration: 10 + Math.random() * 14,
        delay: item.delay,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }))
    })
  })
})

onUnmounted(() => {
  tweens.forEach(t => t.kill())
})
</script>

<template>
  <div ref="containerRef" class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <svg
      v-for="(el, i) in elements"
      :key="i"
      class="orn-el absolute"
      :style="{
        left: `${el.x}%`,
        top: `${el.y}%`,
        width: `${el.size}px`,
        height: `${el.size}px`,
        opacity: el.opacity,
        transform: `rotate(${el.rotation}deg)`,
        willChange: 'transform',
      }"
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        :d="el.type === 'diamond' ? DIAMOND_PATH
          : el.type === 'star'    ? STAR_PATH
          : el.type === 'cross'   ? CROSS_PATH
          : CIRCLE_PATH"
        stroke="var(--cyber-text)"
        stroke-width="4"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>
