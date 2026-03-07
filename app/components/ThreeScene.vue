<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type * as THREETypes from 'three'

const containerRef = ref<HTMLDivElement>()
let renderer: THREETypes.WebGLRenderer
let animationId: number
let mouseNX = 0.5, mouseNY = 0.5

function onMouseMove(e: MouseEvent) {
  mouseNX = e.clientX / window.innerWidth
  mouseNY = e.clientY / window.innerHeight
}

onMounted(async () => {
  if (!containerRef.value) return

  const THREE = await import('three')

  window.addEventListener('mousemove', onMouseMove)

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
  const sizes = new Float32Array(pointCount)

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
    sizes[i] = 0.015 + Math.random() * 0.015
  }

  const pointsGeometry = new THREE.BufferGeometry()
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x89b4fa,
    size: 0.025,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  })
  const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial)
  scene.add(pointsMesh)

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

  // Outer ring
  const ringGeometry = new THREE.TorusGeometry(3.2, 0.004, 8, 140)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x565f89,
    transparent: true,
    opacity: 0.3,
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI / 2
  scene.add(ring)

  // Inner ring
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

    // Cursor-following rotation with slow base spin
    const targetRotY = time * 0.2 + (mouseNX - 0.5) * 0.6
    const targetRotX = Math.sin(time * 0.15) * 0.08 + (mouseNY - 0.5) * 0.4
    currentRotY += (targetRotY - currentRotY) * 0.025
    currentRotX += (targetRotX - currentRotX) * 0.025

    pointsMesh.rotation.y = currentRotY
    pointsMesh.rotation.x = currentRotX
    lines.rotation.y = currentRotY
    lines.rotation.x = currentRotX

    // Breathing
    const breathe = 1 + Math.sin(time * 0.5) * 0.03
    pointsMesh.scale.setScalar(breathe)
    lines.scale.setScalar(breathe)

    // Rings
    ring.rotation.x = Math.PI / 2 + Math.sin(time * 0.12) * 0.12
    ring.rotation.z = time * 0.03
    ring2.rotation.x = Math.PI / 2 - Math.sin(time * 0.1) * 0.08
    ring2.rotation.z = -time * 0.05

    // Particle drift
    const posArray = pointsGeometry.attributes.position!.array as Float32Array
    for (let i = 0; i < pointCount; i++) {
      posArray[i * 3] = originalPositions[i * 3]! + Math.sin(time + i * 0.1) * 0.02
      posArray[i * 3 + 1] = originalPositions[i * 3 + 1]! + Math.cos(time * 0.6 + i * 0.15) * 0.02
      posArray[i * 3 + 2] = originalPositions[i * 3 + 2]! + Math.sin(time * 0.4 + i * 0.2) * 0.02
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
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 z-0" />
</template>
