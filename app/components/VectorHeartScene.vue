<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type * as THREETypes from 'three'

const props = defineProps<{
  pulseIntensity?: number
}>()

const containerRef = ref<HTMLDivElement>()
let renderer: THREETypes.WebGLRenderer
let animationId: number

const { nx, ny, isMobile } = useInputDirection()

function createDiamondTexture(THREE: typeof import('three'), size = 96): THREETypes.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  const cx = size / 2; const lw = Math.max(1.5, size * 0.032)
  ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = lw
  ctx.beginPath()
  ctx.moveTo(cx, cx * 0.1); ctx.lineTo(cx * 1.9, cx); ctx.lineTo(cx, cx * 1.9); ctx.lineTo(cx * 0.1, cx); ctx.closePath()
  ctx.stroke()
  const ir = cx * 0.46; ctx.lineWidth = lw * 0.55
  ctx.beginPath()
  ctx.moveTo(cx - ir, cx - ir); ctx.lineTo(cx + ir, cx - ir); ctx.lineTo(cx + ir, cx + ir); ctx.lineTo(cx - ir, cx + ir); ctx.closePath()
  ctx.stroke()
  return new THREE.CanvasTexture(canvas)
}

function createStarburstTexture(THREE: typeof import('three'), size = 96): THREETypes.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  const cx = size / 2; const lw = Math.max(1, size * 0.026)
  ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; ctx.lineWidth = lw
  const outer = cx * 0.88; const inner = cx * 0.2
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * inner, cx + Math.sin(a) * inner)
    ctx.lineTo(cx + Math.cos(a) * outer, cx + Math.sin(a) * outer); ctx.stroke()
  }
  ctx.lineWidth = lw * 0.6; ctx.beginPath(); ctx.arc(cx, cx, inner * 1.1, 0, Math.PI * 2); ctx.stroke()
  ctx.lineWidth = lw * 0.4
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * Math.PI * 2 + Math.PI / 8 * 0.3
    const a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 8 * 0.3
    ctx.beginPath(); ctx.arc(cx, cx, outer * 0.75, a0, a1); ctx.stroke()
  }
  return new THREE.CanvasTexture(canvas)
}

function createFloralTexture(THREE: typeof import('three'), size = 96): THREETypes.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  const cx = size / 2; const lw = Math.max(1, size * 0.03)
  ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; ctx.lineWidth = lw
  const r = cx * 0.82
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2; const cos = Math.cos(a); const sin = Math.sin(a); const perp = cx * 0.36
    ctx.beginPath(); ctx.moveTo(cx, cx)
    ctx.bezierCurveTo(cx + cos * r * 0.5 + sin * perp, cx + sin * r * 0.5 - cos * perp,
      cx + cos * r * 0.9 + sin * perp * 0.3, cx + sin * r * 0.9 - cos * perp * 0.3, cx + cos * r, cx + sin * r)
    ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cx)
    ctx.bezierCurveTo(cx + cos * r * 0.5 - sin * perp, cx + sin * r * 0.5 + cos * perp,
      cx + cos * r * 0.9 - sin * perp * 0.3, cx + sin * r * 0.9 + cos * perp * 0.3, cx + cos * r, cx + sin * r)
    ctx.stroke()
  }
  ctx.beginPath(); ctx.arc(cx, cx, lw * 1.6, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

function randomShapeGeo(THREE: typeof import('three'), size: number): THREETypes.BufferGeometry {
  const pick = Math.floor(Math.random() * 9)
  switch (pick) {
    case 0: return new THREE.IcosahedronGeometry(size * 0.58, 0)
    case 1: return new THREE.IcosahedronGeometry(size * 0.52, 1)
    case 2: return new THREE.OctahedronGeometry(size * 0.62)
    case 3: return new THREE.TetrahedronGeometry(size * 0.72)
    case 4: return new THREE.DodecahedronGeometry(size * 0.48)
    case 5: return new THREE.TorusGeometry(size * 0.38, size * 0.1, 5, 7)
    case 6: return new THREE.ConeGeometry(size * 0.38, size * 0.82, 6)
    case 7: return new THREE.CylinderGeometry(size * 0.28, size * 0.28, size * 0.72, 6)
    default: return new THREE.BoxGeometry(size, size, size, 1, 1, 1)
  }
}

onMounted(async () => {
  if (!containerRef.value) return
  const THREE = await import('three')


  const scene = new THREE.Scene()
  // Exponential fog — matches page bg color, naturally fades distant shapes
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.010)

  const camera = new THREE.PerspectiveCamera(55,
    containerRef.value.clientWidth / containerRef.value.clientHeight, 0.1, 1000)
  camera.position.z = 4.8

  // Opaque renderer required for EffectComposer bloom
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x0a0a0a, 1)
  containerRef.value.appendChild(renderer.domElement)

  // ── MAIN GROUP ────────────────────────────────────────────────────
  const mainGroup = new THREE.Group()
  mainGroup.rotation.x = 0.42; mainGroup.rotation.z = 0.28
  scene.add(mainGroup)

  const geoPalette = [
    '#6a8fff', '#a066ff', '#ff5577', '#44ccff',
    '#ff9944', '#66ffcc', '#ff44aa', '#88aaff',
  ]
  const randColor = () => geoPalette[Math.floor(Math.random() * geoPalette.length)]!

  function makeDistortCube(size: number, segs: number, color: string, opacity: number, lw = 2) {
    const geo = new THREE.BoxGeometry(size, size, size, segs, segs, segs)
    const edgesGeo = new THREE.EdgesGeometry(geo)
    const orig = Float32Array.from(edgesGeo.attributes["position"]!.array as Float32Array)
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      linewidth: lw,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const mesh = new THREE.LineSegments(edgesGeo, mat)
    return { mesh, edgesGeo, orig, mat }
  }

  const cube1 = makeDistortCube(3.0, 6, randColor(), 0.42, 2)
  mainGroup.add(cube1.mesh)

  const cube2 = makeDistortCube(2.2, 5, randColor(), 0.28, 2)
  cube2.mesh.rotation.y = Math.PI / 4; cube2.mesh.rotation.x = Math.PI / 6
  mainGroup.add(cube2.mesh)

  const cube3 = makeDistortCube(1.3, 3, randColor(), 0.20, 1)
  mainGroup.add(cube3.mesh)

  const cube4Geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.8, 3.8, 3.8, 1, 1, 1))
  const cube4Mat = new THREE.LineBasicMaterial({ color: new THREE.Color(randColor()), transparent: true, opacity: 0.18, linewidth: 1, blending: THREE.AdditiveBlending, depthWrite: false })
  const cube4Mesh = new THREE.LineSegments(cube4Geo, cube4Mat)
  mainGroup.add(cube4Mesh)

  // Distorting sphere
  const sphereIcoGeo = new THREE.IcosahedronGeometry(1.0, 2)
  const sphereEdgesGeo = new THREE.EdgesGeometry(sphereIcoGeo)
  const origSpherePos = Float32Array.from(sphereEdgesGeo.attributes["position"]!.array as Float32Array)
  const sphereMat = new THREE.LineBasicMaterial({ color: new THREE.Color(randColor()), transparent: true, opacity: 0.38, linewidth: 1, blending: THREE.AdditiveBlending, depthWrite: false })
  const sphereMesh = new THREE.LineSegments(sphereEdgesGeo, sphereMat)
  mainGroup.add(sphereMesh)

  // Corner dots
  const nodePalette = [
    new THREE.Color(0x2a3a6a), new THREE.Color(0x4a2060), new THREE.Color(0x5c1a2e),
    new THREE.Color(0x1e2d58), new THREE.Color(0x3d1a50), new THREE.Color(0x4a1020),
  ]
  const cBox = new THREE.BoxGeometry(3.0, 3.0, 3.0, 1, 1, 1)
  const cPos = cBox.attributes.position as THREETypes.BufferAttribute
  const seenK = new Set<string>(); const cVerts: number[] = []
  for (let i = 0; i < cPos.count; i++) {
    const x = Math.round(cPos.getX(i) * 100) / 100
    const y = Math.round(cPos.getY(i) * 100) / 100
    const z = Math.round(cPos.getZ(i) * 100) / 100
    const k = `${x},${y},${z}`
    if (!seenK.has(k)) { seenK.add(k); cVerts.push(x, y, z) }
  }
  const dColors = new Float32Array(cVerts.length)
  for (let i = 0; i < cVerts.length / 3; i++) {
    const c = nodePalette[Math.floor(Math.random() * nodePalette.length)]!
    dColors[i * 3] = c.r; dColors[i * 3 + 1] = c.g; dColors[i * 3 + 2] = c.b
  }
  const dotGeo = new THREE.BufferGeometry()
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(cVerts, 3))
  dotGeo.setAttribute('color', new THREE.Float32BufferAttribute(dColors, 3))
  const dotMat = new THREE.PointsMaterial({ size: 0.022, transparent: true, opacity: 0.85, sizeAttenuation: true, vertexColors: true })
  mainGroup.add(new THREE.Points(dotGeo, dotMat))

  // ── ORNAMENTAL SPRITES ────────────────────────────────────────────
  const spritePalette = [
    new THREE.Color(0x4a6abe), new THREE.Color(0x7a42a0), new THREE.Color(0xbe2840),
    new THREE.Color(0x2a3a6a), new THREE.Color(0x3d1a50), new THREE.Color(0x5c1a2e),
    new THREE.Color(0x1e5888), new THREE.Color(0x5a3a90), new THREE.Color(0x883a20),
    new THREE.Color(0x2a6858), new THREE.Color(0xa86a10), new THREE.Color(0x3a6a2a),
  ]
  const diamondTex = createDiamondTexture(THREE, 96)
  const starTex = createStarburstTexture(THREE, 96)
  const floralTex = createFloralTexture(THREE, 96)
  const texPool = [diamondTex, starTex, floralTex]
  const spriteCount = isMobile.value ? 45 : 90
  const spriteBaseOpacity: number[] = []

  for (let i = 0; i < spriteCount; i++) {
    const baseOp = 0.32 + Math.random() * 0.28
    spriteBaseOpacity.push(baseOp)
    const tex = texPool[Math.floor(Math.random() * texPool.length)]!
    const tint = spritePalette[Math.floor(Math.random() * spritePalette.length)]!
    const mat = new THREE.SpriteMaterial({ map: tex, color: tint, transparent: true, opacity: baseOp })
    const sprite = new THREE.Sprite(mat)
    const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1)
    const r = 1.7 + Math.random() * 0.9
    sprite.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
    const s = 0.04 + Math.random() * 0.055; sprite.scale.set(s, s, 1)
    mainGroup.add(sprite)
  }

  // ── RINGS ─────────────────────────────────────────────────────────
  const ringGroup = new THREE.Group()
  ringGroup.rotation.x = 0.42; ringGroup.rotation.z = 0.28
  scene.add(ringGroup)

  interface RingEntry { mesh: THREETypes.Mesh; mat: THREETypes.MeshBasicMaterial; baseOpacity: number; speed: number }
  const ringDefs = [
    { radius: 2.8, tube: 0.003, tiltX: Math.PI / 2,    tiltZ: 0,   color: '#d8d4cc', opacity: 0.16, speed:  0.018 },
    { radius: 2.2, tube: 0.002, tiltX: Math.PI / 3,    tiltZ: 0.4, color: '#f0ece8', opacity: 0.10, speed: -0.024 },
    { radius: 3.2, tube: 0.002, tiltX: Math.PI / 5,    tiltZ: 1.1, color: '#c0bbb5', opacity: 0.07, speed:  0.011 },
    { radius: 1.6, tube: 0.002, tiltX: Math.PI * 0.72, tiltZ: 0.8, color: '#ffffff', opacity: 0.05, speed: -0.03  },
  ]
  const rings: RingEntry[] = []
  const maxRings = isMobile.value ? 2 : ringDefs.length
  for (let ri = 0; ri < maxRings; ri++) {
    const def = ringDefs[ri]!
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(def.color), transparent: true, opacity: def.opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(def.radius, def.tube, 8, 200), mat)
    mesh.rotation.x = def.tiltX; mesh.rotation.z = def.tiltZ
    ringGroup.add(mesh)
    rings.push({ mesh, mat, baseOpacity: def.opacity, speed: def.speed })
  }

  // ── FLOATING SHAPES with mouse proximity ──────────────────────────
  interface FloatShape {
    mesh: THREETypes.LineSegments
    edgesGeo: THREETypes.BufferGeometry
    orig: Float32Array
    mat: THREETypes.LineBasicMaterial
    basePos: THREETypes.Vector3
    floatPhase: number
    floatSpeed: number
    rotSpeed: THREETypes.Vector3
    distortPhase: number
    distortSpeed: number
    distortAmp: number
    baseOpacity: number
    repelDisp: THREETypes.Vector3  // mouse proximity displacement
  }

  const floatShapes: FloatShape[] = []
  const floatCount = isMobile.value ? 10 : 22

  for (let i = 0; i < floatCount; i++) {
    const size = 0.14 + Math.random() * 0.30
    const color = geoPalette[Math.floor(Math.random() * geoPalette.length)]!
    const baseOp = 0.06 + Math.random() * 0.09

    const geo = randomShapeGeo(THREE, size)
    const edgesGeo = new THREE.EdgesGeometry(geo)
    const orig = Float32Array.from(edgesGeo.attributes["position"]!.array as Float32Array)
    const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: baseOp, linewidth: 1, blending: THREE.AdditiveBlending, depthWrite: false })
    const mesh = new THREE.LineSegments(edgesGeo, mat)

    const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1)
    const r = 2.8 + Math.random() * 2.2
    const bx = r * Math.sin(phi) * Math.cos(theta)
    const by = r * Math.sin(phi) * Math.sin(theta)
    const bz = r * Math.cos(phi)

    mesh.position.set(bx, by, bz)
    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
    scene.add(mesh)

    floatShapes.push({
      mesh, edgesGeo, orig, mat,
      basePos: new THREE.Vector3(bx, by, bz),
      floatPhase:   Math.random() * Math.PI * 2,
      floatSpeed:   0.22 + Math.random() * 0.42,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.4,
      ),
      distortPhase: Math.random() * Math.PI * 2,
      distortSpeed: 2.5 + Math.random() * 3.0,
      distortAmp:   0.015 + Math.random() * 0.028,
      baseOpacity:  baseOp,
      repelDisp:    new THREE.Vector3(),
    })
  }

  let time = 0; let currentRotX = 0; let currentRotY = 0

  function distortEdges(edgesGeo: THREETypes.BufferGeometry, origPos: Float32Array,
    t: number, speed: number, amp: number, freq: number) {
    const pos = edgesGeo.attributes["position"]!.array as Float32Array
    for (let i = 0; i < origPos.length / 3; i++) {
      const ox = origPos[i * 3]!; const oy = origPos[i * 3 + 1]!; const oz = origPos[i * 3 + 2]!
      const p = t * speed + i * 0.09
      pos[i * 3]     = ox + Math.sin(p + oy * freq) * amp
      pos[i * 3 + 1] = oy + Math.cos(p + oz * freq) * amp
      pos[i * 3 + 2] = oz + Math.sin(p * 0.7 + ox * freq) * amp
    }
    edgesGeo.attributes["position"]!.needsUpdate = true
  }

  function animate() {
    time += 0.002
    const pulse = props.pulseIntensity ?? 0

    const targetRotY = (nx.value - 0.5) * 0.6
    const targetRotX = (ny.value - 0.5) * 0.4
    currentRotY += (targetRotY - currentRotY) * 0.025
    currentRotX += (targetRotX - currentRotX) * 0.025

    const autoSpin = time * 0.12
    mainGroup.rotation.y = autoSpin + currentRotY
    mainGroup.rotation.x = 0.42 + currentRotX
    mainGroup.rotation.z = 0.28

    distortEdges(cube1.edgesGeo, cube1.orig, time, 1.8, 0.06 + pulse * 0.14, 1.4)
    distortEdges(cube2.edgesGeo, cube2.orig, time, 2.4, 0.04 + pulse * 0.09, 1.6)
    distortEdges(cube3.edgesGeo, cube3.orig, time, 3.2, 0.03 + pulse * 0.07, 1.8)
    distortEdges(sphereEdgesGeo, origSpherePos, time, 1.2, 0.05 + pulse * 0.12, 1.2)

    const breathe = 1 + Math.sin(time * 0.5) * 0.02
    mainGroup.scale.setScalar(breathe + pulse * 0.05)

    cube2.mesh.rotation.y = Math.PI / 4 - autoSpin * 0.18
    cube2.mesh.rotation.x = Math.PI / 6 + currentRotX * 0.3
    cube3.mesh.rotation.y = autoSpin * 1.6; cube3.mesh.rotation.z = autoSpin * 0.8
    cube4Mesh.rotation.y = autoSpin * 1.9; cube4Mesh.rotation.x = autoSpin * 0.6
    sphereMesh.rotation.y = -autoSpin * 0.4; sphereMesh.rotation.z = autoSpin * 0.2

    cube1.mat.opacity = 0.42 + pulse * 0.3; cube2.mat.opacity = 0.28 + pulse * 0.22
    cube3.mat.opacity = 0.20 + pulse * 0.18; cube4Mat.opacity = 0.18 + pulse * 0.16
    sphereMat.opacity = 0.38 + pulse * 0.28
    dotMat.opacity = 0.85 + pulse * 0.15; dotMat.size = 0.022 + pulse * 0.012

    ringGroup.rotation.y = autoSpin * 0.4 + currentRotY * 0.5
    ringGroup.rotation.x = 0.42 + currentRotX * 0.3
    rings.forEach(({ mesh, mat, baseOpacity, speed }) => {
      mesh.rotation.z += speed * 0.01
      mat.opacity = Math.min(baseOpacity + pulse * 0.25, 0.6)
    })

    let si = 0
    mainGroup.children.forEach((child) => {
      if (child instanceof THREE.Sprite) {
        const bo = spriteBaseOpacity[si] ?? 0.35
        ;(child.material as THREETypes.SpriteMaterial).opacity = Math.min(bo + pulse * 0.3, 0.85)
        si++
      }
    })

    // ── Floating shapes — drift + mouse proximity repulsion ───────────
    // Mouse NDC for proximity test (skip on mobile — no hover)
    const mouseNDCx = !isMobile.value ? (nx.value - 0.5) * 2 : 9999
    const mouseNDCy = !isMobile.value ? -(ny.value - 0.5) * 2 : 9999

    floatShapes.forEach((fc) => {
      // Project shape to screen space to measure proximity
      const screenPos = fc.mesh.position.clone().project(camera)
      const dx = screenPos.x - mouseNDCx
      const dy = screenPos.y - mouseNDCy
      const screenDist = Math.sqrt(dx * dx + dy * dy)
      const proxRadius = 0.38

      if (screenDist < proxRadius) {
        const str = ((proxRadius - screenDist) / proxRadius) * 0.045
        const angle = Math.atan2(dy, dx)
        fc.repelDisp.x += Math.cos(angle) * str
        fc.repelDisp.y += Math.sin(angle) * str
        // Brighten on proximity
        fc.mat.opacity = Math.min(fc.baseOpacity * 2.5 + pulse * 0.15, 0.38)
      }
      else {
        fc.mat.opacity = Math.min(fc.baseOpacity + pulse * 0.15, 0.28)
      }

      // Decay displacement — shape drifts back to base orbit
      fc.repelDisp.multiplyScalar(0.88)

      // Float drift + repulsion
      const fp = time * fc.floatSpeed + fc.floatPhase
      fc.mesh.position.x = fc.basePos.x + Math.sin(fp) * 0.18 + fc.repelDisp.x
      fc.mesh.position.y = fc.basePos.y + Math.cos(fp * 0.73) * 0.18 + fc.repelDisp.y
      fc.mesh.position.z = fc.basePos.z + Math.sin(fp * 0.51) * 0.14

      fc.mesh.rotation.x += fc.rotSpeed.x * 0.01
      fc.mesh.rotation.y += fc.rotSpeed.y * 0.01
      fc.mesh.rotation.z += fc.rotSpeed.z * 0.01

      // Twist distortion
      const pos = fc.edgesGeo.attributes["position"]!.array as Float32Array
      const t2 = time + fc.distortPhase
      const amp = fc.distortAmp + pulse * 0.025
      for (let i = 0; i < fc.orig.length / 3; i++) {
        const ox = fc.orig[i * 3]!; const oy = fc.orig[i * 3 + 1]!; const oz = fc.orig[i * 3 + 2]!
        const p = t2 * fc.distortSpeed + i * 0.14
        pos[i * 3]     = ox + Math.cos(p + oz * 2.2) * amp
        pos[i * 3 + 1] = oy + Math.sin(p * 1.3 + ox * 2.2) * amp
        pos[i * 3 + 2] = oz + Math.cos(p * 0.9 + oy * 2.2) * amp
      }
      fc.edgesGeo.attributes["position"]!.needsUpdate = true
    })

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
