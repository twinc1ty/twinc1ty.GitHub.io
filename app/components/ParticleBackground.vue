<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue'

const route = useRoute()

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number

interface Particle {
  // 3D position on sphere
  x: number
  y: number
  z: number
  // Distortion offset (displaces from sphere surface)
  dx: number
  dy: number
  dz: number
  size: number
  color: string
  baseAlpha: number
  energy: number
}

interface Signal {
  fromIndex: number
  toIndex: number
  progress: number
  strength: number
}

const colors = ['#7aa2f7', '#565f89', '#414868']
const particleCount = 120
const connectionDistance3D = 0.6
const signalSpeed = 0.04
const maxSignals = 40
const particles: Particle[] = []
const signals: Signal[] = []

let mouseX = 0
let mouseY = 0
let isHovering = false
let autoTimer: ReturnType<typeof setTimeout> | null = null

// Trigger distortion — scatters particles in random directions
function distortSphere(intensity: number = 0.5) {
  for (const p of particles) {
    // Fully random direction — not biased along the normal
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = intensity * (0.3 + Math.random() * 0.7)
    p.dx = Math.sin(phi) * Math.cos(theta) * r
    p.dy = Math.sin(phi) * Math.sin(theta) * r
    p.dz = Math.cos(phi) * r
    // Flash energy
    p.energy = Math.max(p.energy, 0.3 + Math.random() * 0.5)
  }
}

// Watch for route changes
watch(() => route.path, () => {
  distortSphere(0.4)
})

// Rotation angles
let rotX = 0
let rotY = 0
// Target rotation velocity from mouse
let targetVelX = 0.0005
let targetVelY = 0.0008
let velX = 0.0005
let velY = 0.0008

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // Distribute particles on sphere using golden spiral
  const goldenRatio = (1 + Math.sqrt(5)) / 2
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.acos(1 - 2 * (i + 0.5) / particleCount)
    const phi = 2 * Math.PI * i / goldenRatio
    const baseAlpha = Math.random() * 0.3 + 0.1
    particles.push({
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
      dx: 0, dy: 0, dz: 0,
      size: Math.random() * 1.2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      baseAlpha,
      energy: 0,
    })
  }

  function onMouseMove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
    isHovering = true

    // Mouse offset from center drives rotation direction and speed
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const dx = (e.clientX - cx) / cx // -1 to 1
    const dy = (e.clientY - cy) / cy // -1 to 1

    targetVelX = dy * 0.02
    targetVelY = dx * 0.02
  }

  function onMouseLeave() {
    isHovering = false
    // Slow drift when mouse leaves
    targetVelX = 0.0005
    targetVelY = 0.0008
  }

  function onClick(e: MouseEvent) {
    // Find closest projected particle to click
    const radius = Math.min(canvas.width, canvas.height) * 0.35
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    let closestIdx = 0
    let closestDist = Infinity

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const scale = 800 / (800 + p.z * radius)
      const px = cx + p.x * radius * scale
      const py = cy + p.y * radius * scale
      const dist = Math.sqrt((e.clientX - px) ** 2 + (e.clientY - py) ** 2)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    }

    if (closestDist < 200) {
      triggerPulse(closestIdx, 1)
    }
  }

  function triggerPulse(originIdx: number, strength: number) {
    particles[originIdx].energy = Math.max(particles[originIdx].energy, strength)

    // Find nearby neighbors in 3D space
    const origin = particles[originIdx]
    const neighbors: { idx: number; dist: number }[] = []
    for (let j = 0; j < particles.length; j++) {
      if (j === originIdx) continue
      const dx = origin.x - particles[j].x
      const dy = origin.y - particles[j].y
      const dz = origin.z - particles[j].z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < connectionDistance3D * 1.5) {
        neighbors.push({ idx: j, dist })
      }
    }
    neighbors.sort((a, b) => a.dist - b.dist)
    const targets = neighbors.slice(0, 4)

    for (const t of targets) {
      if (signals.length >= maxSignals) break
      signals.push({
        fromIndex: originIdx,
        toIndex: t.idx,
        progress: 0,
        strength: strength * (1 - t.dist / (connectionDistance3D * 1.5)) * 0.8,
      })
    }
  }

  function scheduleAutoPulse() {
    const delay = 1500 + Math.random() * 3000
    autoTimer = setTimeout(() => {
      const originIdx = Math.floor(Math.random() * particles.length)
      triggerPulse(originIdx, 0.5 + Math.random() * 0.5)
      scheduleAutoPulse()
    }, delay)
  }
  scheduleAutoPulse()

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('click', onClick)

  // Rotate a point around X axis
  function rotateX(p: Particle, angle: number) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const y = p.y * cos - p.z * sin
    const z = p.y * sin + p.z * cos
    p.y = y
    p.z = z
  }

  // Rotate a point around Y axis
  function rotateY(p: Particle, angle: number) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = p.x * cos + p.z * sin
    const z = -p.x * sin + p.z * cos
    p.x = x
    p.z = z
  }

  function draw() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height)

    const radius = Math.min(canvas.width, canvas.height) * 0.35
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const focalLength = 800

    // Smooth rotation velocity toward target
    velX += (targetVelX - velX) * 0.05
    velY += (targetVelY - velY) * 0.05

    // Apply rotation to all particles and decay distortion
    for (const p of particles) {
      rotateX(p, velX)
      rotateY(p, velY)
      // Decay distortion back toward sphere surface
      p.dx *= 0.94
      p.dy *= 0.94
      p.dz *= 0.94
      if (Math.abs(p.dx) < 0.001) p.dx = 0
      if (Math.abs(p.dy) < 0.001) p.dy = 0
      if (Math.abs(p.dz) < 0.001) p.dz = 0
    }

    // Sort by z for depth ordering (back to front)
    const indices = particles.map((_, i) => i)
    indices.sort((a, b) => (particles[a].z + particles[a].dz) - (particles[b].z + particles[b].dz))

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]
        const b = particles[j]
        // Use displaced positions for rendering
        const apx = a.x + a.dx, apy = a.y + a.dy, apz = a.z + a.dz
        const bpx = b.x + b.dx, bpy = b.y + b.dy, bpz = b.z + b.dz
        const ddx = apx - bpx
        const ddy = apy - bpy
        const ddz = apz - bpz
        const dist3D = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz)

        if (dist3D < connectionDistance3D) {
          // Fade out connections based on distortion amount
          const distortA = Math.sqrt(a.dx * a.dx + a.dy * a.dy + a.dz * a.dz)
          const distortB = Math.sqrt(b.dx * b.dx + b.dy * b.dy + b.dz * b.dz)
          const distortFade = Math.max(0, 1 - (distortA + distortB) * 4)
          if (distortFade < 0.01) continue
          const scaleA = focalLength / (focalLength + apz * radius)
          const scaleB = focalLength / (focalLength + bpz * radius)
          const ax = cx + apx * radius * scaleA
          const ay = cy + apy * radius * scaleA
          const bx = cx + bpx * radius * scaleB
          const by = cy + bpy * radius * scaleB

          // Depth-based fade (back particles are dimmer)
          const avgZ = (apz + bpz) / 2
          const depthFade = (1 - avgZ) * 0.5 // z ranges -1 to 1

          const baseOpacity = (1 - dist3D / connectionDistance3D) * 0.08 * depthFade * distortFade
          const energyBoost = Math.max(a.energy, b.energy)
          const opacity = baseOpacity + energyBoost * 0.3 * depthFade

          if (energyBoost > 0.1) {
            ctx!.strokeStyle = `rgba(122, 162, 247, ${opacity})`
            ctx!.lineWidth = (0.5 + energyBoost * 2) * depthFade
            ctx!.shadowColor = '#7aa2f7'
            ctx!.shadowBlur = energyBoost * 8
          } else {
            ctx!.strokeStyle = `rgba(122, 162, 247, ${opacity})`
            ctx!.lineWidth = 0.5 * depthFade
            ctx!.shadowBlur = 0
          }

          ctx!.beginPath()
          ctx!.moveTo(ax, ay)
          ctx!.lineTo(bx, by)
          ctx!.stroke()
          ctx!.shadowBlur = 0
        }
      }
    }

    // Draw and update signals
    for (let s = signals.length - 1; s >= 0; s--) {
      const sig = signals[s]
      sig.progress += signalSpeed

      const from = particles[sig.fromIndex]
      const to = particles[sig.toIndex]

      // Interpolate in 3D using displaced positions
      const fx = from.x + from.dx, fy = from.y + from.dy, fz = from.z + from.dz
      const tx = to.x + to.dx, ty = to.y + to.dy, tz = to.z + to.dz
      const sx3d = fx + (tx - fx) * sig.progress
      const sy3d = fy + (ty - fy) * sig.progress
      const sz3d = fz + (tz - fz) * sig.progress

      const scale = focalLength / (focalLength + sz3d * radius)
      const sx = cx + sx3d * radius * scale
      const sy = cy + sy3d * radius * scale

      const pulseAlpha = sig.strength * (1 - sig.progress) * ((1 - sz3d) * 0.5)
      const pulseSize = (2 + sig.strength * 4) * scale

      ctx!.beginPath()
      ctx!.arc(sx, sy, pulseSize, 0, Math.PI * 2)
      const gradient = ctx!.createRadialGradient(sx, sy, 0, sx, sy, pulseSize)
      gradient.addColorStop(0, `rgba(122, 200, 255, ${pulseAlpha})`)
      gradient.addColorStop(0.5, `rgba(122, 162, 247, ${pulseAlpha * 0.6})`)
      gradient.addColorStop(1, `rgba(122, 162, 247, 0)`)
      ctx!.fillStyle = gradient
      ctx!.fill()

      if (sig.progress >= 1) {
        to.energy = Math.max(to.energy, sig.strength * 0.7)
        signals.splice(s, 1)
      }
    }

    // Draw particles (sorted back to front)
    for (const i of indices) {
      const p = particles[i]
      const ppx = p.x + p.dx, ppy = p.y + p.dy, ppz = p.z + p.dz
      const scale = focalLength / (focalLength + ppz * radius)
      const px = cx + ppx * radius * scale
      const py = cy + ppy * radius * scale

      // Depth fade
      const depthFade = (1 - ppz) * 0.5

      // Hover glow
      let hoverGlow = 0
      if (isHovering) {
        const dx = px - mouseX
        const dy = py - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 160) {
          hoverGlow = (1 - dist / 160) * 0.5
        }
      }

      const totalEnergy = p.energy + hoverGlow
      const drawAlpha = (p.baseAlpha + totalEnergy * 0.7) * depthFade
      const drawSize = (p.size + totalEnergy * 2) * scale

      if (totalEnergy > 0.1) {
        ctx!.shadowColor = '#7aa2f7'
        ctx!.shadowBlur = totalEnergy * 12
      }

      ctx!.beginPath()
      ctx!.arc(px, py, drawSize, 0, Math.PI * 2)

      if (totalEnergy > 0.3) {
        ctx!.fillStyle = `rgba(200, 220, 255, ${drawAlpha})`
      } else {
        ctx!.fillStyle = p.color
      }

      ctx!.globalAlpha = Math.min(Math.max(drawAlpha, 0), 1)
      ctx!.fill()
      ctx!.globalAlpha = 1
      ctx!.shadowBlur = 0

      // Energy decay
      p.energy *= 0.92
      if (p.energy < 0.01) p.energy = 0
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
  if (autoTimer) clearTimeout(autoTimer)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 z-0 pointer-events-none"
  />
</template>
