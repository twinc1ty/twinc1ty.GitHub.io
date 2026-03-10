<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type * as THREETypes from 'three'

const props = defineProps<{
  pulseIntensity?: number
}>()

const containerRef = ref<HTMLDivElement>()
let renderer: THREETypes.WebGLRenderer
let animationId: number

const { nx, ny } = useInputDirection()

onMounted(async () => {
  if (!containerRef.value) return

  const THREE = await import('three')

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    55,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1000,
  )
  camera.position.z = 4.2

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  containerRef.value.appendChild(renderer.domElement)

  const pointCount = 600
  const positions = new Float32Array(pointCount * 3)
  const originalPositions = new Float32Array(pointCount * 3)

  for (let i = 0; i < pointCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 1.8 + Math.random() * 1.6

    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    originalPositions[i * 3] = x
    originalPositions[i * 3 + 1] = y
    originalPositions[i * 3 + 2] = z
  }

  const pointsGeometry = new THREE.BufferGeometry()
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const colors = new Float32Array(pointCount * 3)
  const baseColors = new Float32Array(pointCount * 3)
  const baseColor = new THREE.Color(0x89b4fa)

  const neonPalette = [
    new THREE.Color(0x7aa2f7), // blue
    new THREE.Color(0xbb9af7), // purple
    new THREE.Color(0x9ece6a), // green
    new THREE.Color(0xff9e64), // orange
    new THREE.Color(0x2ac3de), // cyan
    new THREE.Color(0xf7768e), // pink
  ]
  const particleNeonIndex = new Uint8Array(pointCount)
  for (let i = 0; i < pointCount; i++) {
    baseColors[i * 3] = baseColor.r
    baseColors[i * 3 + 1] = baseColor.g
    baseColors[i * 3 + 2] = baseColor.b
    colors[i * 3] = baseColor.r
    colors[i * 3 + 1] = baseColor.g
    colors[i * 3 + 2] = baseColor.b
    particleNeonIndex[i] = Math.floor(Math.random() * neonPalette.length)
  }
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.025,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
    vertexColors: true,
  })
  const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial)
  scene.add(pointsMesh)
  const tempColor = new THREE.Color()

  // Connection lines
  const linePositions: number[] = []
  for (let i = 0; i < pointCount; i++) {
    for (let j = i + 1; j < pointCount; j++) {
      const dx = positions[i * 3]! - positions[j * 3]!
      const dy = positions[i * 3 + 1]! - positions[j * 3 + 1]!
      const dz = positions[i * 3 + 2]! - positions[j * 3 + 2]!
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < 0.7 && Math.random() > 0.4) {
        linePositions.push(
          positions[i * 3]!, positions[i * 3 + 1]!, positions[i * 3 + 2]!,
          positions[j * 3]!, positions[j * 3 + 1]!, positions[j * 3 + 2]!,
        )
      }
    }
  }

  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x7aa2f7,
    transparent: true,
    opacity: 0.09,
  })
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(lines)

  const ringGeometry = new THREE.TorusGeometry(3.2, 0.004, 8, 140)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x565f89,
    transparent: true,
    opacity: 0.3,
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI / 2
  scene.add(ring)

  const ring2Geometry = new THREE.TorusGeometry(2.2, 0.003, 8, 100)
  const ring2Material = new THREE.MeshBasicMaterial({
    color: 0x414868,
    transparent: true,
    opacity: 0.15,
  })
  const ring2 = new THREE.Mesh(ring2Geometry, ring2Material)
  ring2.rotation.x = Math.PI / 2
  scene.add(ring2)

  let time = 0
  let currentRotX = 0, currentRotY = 0

  function animate() {
    time += 0.002

    const pulse = props.pulseIntensity ?? 0

    const targetRotY = time * 0.2 + (nx.value - 0.5) * 0.6
    const targetRotX = Math.sin(time * 0.15) * 0.08 + (ny.value - 0.5) * 0.4
    currentRotY += (targetRotY - currentRotY) * 0.025
    currentRotX += (targetRotX - currentRotX) * 0.025

    pointsMesh.rotation.y = currentRotY
    pointsMesh.rotation.x = currentRotX
    lines.rotation.y = currentRotY
    lines.rotation.x = currentRotX

    const breathe = 1 + Math.sin(time * 0.5) * 0.03
    const pulseScale = breathe + pulse * 0.05
    pointsMesh.scale.setScalar(pulseScale)
    lines.scale.setScalar(pulseScale)

    const colorArray = pointsGeometry.attributes.color!.array as Float32Array
    for (let i = 0; i < pointCount; i++) {
      const neon = neonPalette[particleNeonIndex[i]!]!
      tempColor.setRGB(
        baseColors[i * 3]! + (neon.r - baseColors[i * 3]!) * pulse,
        baseColors[i * 3 + 1]! + (neon.g - baseColors[i * 3 + 1]!) * pulse,
        baseColors[i * 3 + 2]! + (neon.b - baseColors[i * 3 + 2]!) * pulse,
      )
      colorArray[i * 3] = tempColor.r
      colorArray[i * 3 + 1] = tempColor.g
      colorArray[i * 3 + 2] = tempColor.b
    }
    pointsGeometry.attributes.color!.needsUpdate = true
    pointsMaterial.size = 0.025 + pulse * 0.008
    pointsMaterial.opacity = 0.65 + pulse * 0.35
    lineMaterial.opacity = 0.09 + pulse * 0.15

    ringMaterial.opacity = 0.3 + pulse * 0.4
    ring2Material.opacity = 0.15 + pulse * 0.3
    ring.scale.setScalar(1 + pulse * 0.08)
    ring2.scale.setScalar(1 + pulse * 0.06)

    ring.rotation.x = Math.PI / 2 + Math.sin(time * 0.12) * 0.12
    ring.rotation.z = time * 0.03
    ring2.rotation.x = Math.PI / 2 - Math.sin(time * 0.1) * 0.08
    ring2.rotation.z = -time * 0.05

    const posArray = pointsGeometry.attributes.position!.array as Float32Array
    for (let i = 0; i < pointCount; i++) {
      const ox = originalPositions[i * 3]!
      const oy = originalPositions[i * 3 + 1]!
      const oz = originalPositions[i * 3 + 2]!

      const driftX = Math.sin(time + i * 0.1) * 0.02
      const driftY = Math.cos(time * 0.6 + i * 0.15) * 0.02
      const driftZ = Math.sin(time * 0.4 + i * 0.2) * 0.02

      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1
      const pushAmount = pulse * 0.15
      const pushX = (ox / len) * pushAmount
      const pushY = (oy / len) * pushAmount
      const pushZ = (oz / len) * pushAmount

      posArray[i * 3] = ox + driftX + pushX
      posArray[i * 3 + 1] = oy + driftY + pushY
      posArray[i * 3 + 2] = oz + driftZ + pushZ
    }
    pointsGeometry.attributes.position!.needsUpdate = true

    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)
  }

  animate()

  function onResize() {
    if (!containerRef.value) return
    camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  }

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  renderer?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 z-0" />
</template>
