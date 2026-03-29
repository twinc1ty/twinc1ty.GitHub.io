<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseAlpha: number
  color: string
  dx: number
  dy: number
}

function getThemeColors(): string[] {
  const style = getComputedStyle(document.documentElement)
  return [
    style.getPropertyValue('--cyber-accent').trim() || '#7aa2f7',
    style.getPropertyValue('--cyber-muted').trim() || '#565f89',
    style.getPropertyValue('--cyber-subtle').trim() || '#414868',
    style.getPropertyValue('--cyber-secondary').trim() || '#9ece6a',
  ]
}
let colors = ['#7aa2f7', '#565f89', '#414868', '#9ece6a']
const particleCount = 80
const connectionDistance = 150
const particles: Particle[] = []

let mouseX = -1000
let mouseY = -1000
let distortTimer: ReturnType<typeof setInterval> | null = null

function triggerDistort() {
  for (const p of particles) {
    const angle = Math.random() * Math.PI * 2
    const force = 40 + Math.random() * 80
    p.dx = Math.cos(angle) * force
    p.dy = Math.sin(angle) * force
  }
}

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  colors = getThemeColors()
  const accentRgb = getComputedStyle(document.documentElement).getPropertyValue('--cyber-accent-rgb').trim() || '122, 162, 247'
  const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--cyber-accent').trim() || '#7aa2f7'

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      baseAlpha: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      dx: 0,
      dy: 0,
    })
  }

  function onMouseMove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  function onMouseLeave() {
    mouseX = -1000
    mouseY = -1000
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)

  distortTimer = setInterval(() => {
    triggerDistort()
  }, 4000 + Math.random() * 4000)

  function draw() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.x += p.vx + p.dx * 0.05
      p.y += p.vy + p.dy * 0.05
      p.dx *= 0.92
      p.dy *= 0.92
      if (Math.abs(p.dx) < 0.1) p.dx = 0
      if (Math.abs(p.dy) < 0.1) p.dy = 0

      const mdx = p.x - mouseX
      const mdy = p.y - mouseY
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mDist < 120) {
        const force = (1 - mDist / 120) * 1.5
        p.x += (mdx / mDist) * force
        p.y += (mdy / mDist) * force
      }

      if (p.x < -20) p.x = canvas.width + 20
      if (p.x > canvas.width + 20) p.x = -20
      if (p.y < -20) p.y = canvas.height + 20
      if (p.y > canvas.height + 20) p.y = -20
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]
        const b = particles[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < connectionDistance) {
          const distortA = Math.sqrt(a.dx * a.dx + a.dy * a.dy)
          const distortB = Math.sqrt(b.dx * b.dx + b.dy * b.dy)
          const distortFade = Math.max(0, 1 - (distortA + distortB) * 0.02)

          const alpha = (1 - dist / connectionDistance) * 0.08 * distortFade
          ctx!.strokeStyle = `rgba(${accentRgb}, ${alpha})`
          ctx!.lineWidth = 0.5
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(b.x, b.y)
          ctx!.stroke()
        }
      }
    }

    for (const p of particles) {
      const distort = Math.sqrt(p.dx * p.dx + p.dy * p.dy)
      const glow = Math.min(distort * 0.03, 1)
      const alpha = p.baseAlpha + glow * 0.5
      const size = p.size + glow * 2

      if (glow > 0.1) {
        ctx!.shadowColor = accentHex
        ctx!.shadowBlur = glow * 15
      }

      ctx!.beginPath()
      ctx!.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx!.fillStyle = glow > 0.3 ? `rgba(200, 220, 255, ${alpha})` : p.color
      ctx!.globalAlpha = Math.min(Math.max(alpha, 0), 1)
      ctx!.fill()
      ctx!.globalAlpha = 1
      ctx!.shadowBlur = 0
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

onMounted(() => {
  if (canvasRef.value) {
    init(canvasRef.value)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (distortTimer) clearInterval(distortTimer)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 z-0 pointer-events-none"
  />
</template>
