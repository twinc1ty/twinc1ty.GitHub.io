const nx = ref(0.5)
const ny = ref(0.5)
const isMobile = ref(false)
const gyroAvailable = ref(false)

let initialized = false
let gyroHandler: ((e: DeviceOrientationEvent) => void) | null = null
let mouseHandler: ((e: MouseEvent) => void) | null = null

export function useInputDirection() {
  function init() {
    if (initialized || import.meta.server) return
    initialized = true

    isMobile.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isMobile.value) {
      tryGyroscope()
    }

    mouseHandler = (e: MouseEvent) => {
      if (gyroAvailable.value) return // gyro takes priority
      nx.value = e.clientX / window.innerWidth
      ny.value = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', mouseHandler)
  }

  function tryGyroscope() {
    const doe = DeviceOrientationEvent as any
    if (typeof doe.requestPermission === 'function') {
      return
    }
    startGyroListener()
  }

  function requestGyroPermission(): Promise<boolean> {
    const doe = DeviceOrientationEvent as any
    if (typeof doe.requestPermission === 'function') {
      return doe.requestPermission().then((state: string) => {
        if (state === 'granted') {
          startGyroListener()
          return true
        }
        return false
      }).catch(() => false)
    }
    startGyroListener()
    return Promise.resolve(true)
  }

  function startGyroListener() {
    if (gyroHandler) return
    gyroHandler = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return
      gyroAvailable.value = true

      // gamma: left-right tilt -90 to 90 horizontal
      // beta: front-back tilt -180 to 180 vertical
      // Normaling  to 0-1 range clamping it to comfortable tilt range -30 to 30 degrees  
      const clampedGamma = Math.max(-30, Math.min(30, e.gamma))
      const clampedBeta = Math.max(-30, Math.min(30, e.beta - 30)) // offset 30° for natural phone holding angle maybe 45 idkafter real testing

      nx.value = (clampedGamma + 30) / 60
      ny.value = (clampedBeta + 30) / 60
    }
    window.addEventListener('deviceorientation', gyroHandler)
  }

  function cleanup() {
    if (mouseHandler) window.removeEventListener('mousemove', mouseHandler)
    if (gyroHandler) window.removeEventListener('deviceorientation', gyroHandler)
    mouseHandler = null
    gyroHandler = null
    initialized = false
  }

  return {
    nx: readonly(nx),
    ny: readonly(ny),
    isMobile: readonly(isMobile),
    gyroAvailable: readonly(gyroAvailable),
    init,
    requestGyroPermission,
    cleanup,
  }
}
