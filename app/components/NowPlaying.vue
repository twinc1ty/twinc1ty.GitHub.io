<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

interface SpotifyNowPlaying {
  isPlaying: boolean
  title: string
  artist: string
  albumArt: string | null
  trackUrl: string | null
  playedAt: string | null
}

const track = ref<SpotifyNowPlaying | null>(null)
const failed = ref(false)

async function load() {
  try {
    const res = await fetch('/data/spotify.json', { cache: 'no-store' })
    if (!res.ok) throw new Error('bad response')
    track.value = await res.json()
    failed.value = false
  }
  catch {
    failed.value = true
  }
}

let poll: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  load()
  poll = setInterval(load, 60_000)
})

onBeforeUnmount(() => {
  if (poll) clearInterval(poll)
})
</script>

<template>
  <a
    v-if="track && !failed"
    :href="track.trackUrl ?? undefined"
    :target="track.trackUrl ? '_blank' : undefined"
    rel="noopener noreferrer"
    class="now-playing"
    :class="{ 'is-compact': compact, 'is-link': track.trackUrl }"
  >
    <div class="now-playing__art">
      <img v-if="track.albumArt" :src="track.albumArt" :alt="track.title" />
      <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M9 18V5l12-2v13" stroke="#5b21e0" stroke-width="1.5" />
        <circle cx="6" cy="18" r="3" stroke="#5b21e0" stroke-width="1.5" />
        <circle cx="18" cy="16" r="3" stroke="#5b21e0" stroke-width="1.5" />
      </svg>
    </div>

    <div class="now-playing__info">
      <span class="now-playing__kicker">{{ track.isPlaying ? 'Now playing' : 'Last played' }}</span>
      <span class="now-playing__title">{{ track.title }}</span>
      <span class="now-playing__artist">{{ track.artist }}</span>
    </div>

    <div class="now-playing__eq" :class="{ 'is-paused': !track.isPlaying }">
      <span
        v-for="i in 4"
        :key="i"
        class="now-playing__eq-bar"
        :style="{
          '--peak': 0.45 + (i % 3) * 0.22,
          animationDuration: `${(track.isPlaying ? 0.7 : 1.6) + (i % 3) * 0.2}s`,
          animationDelay: `${i * -0.15}s`,
        }"
      />
    </div>
  </a>
</template>

<style scoped>
.now-playing {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
}

.now-playing.is-link {
  cursor: pointer;
}

.now-playing.is-compact {
  gap: 0.5rem;
}

.now-playing__art {
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border: 1px solid #0b0a0e;
  background: #f1edfb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.now-playing.is-compact .now-playing__art {
  width: 1.7rem;
  height: 1.7rem;
}

.now-playing__art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.now-playing__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.now-playing__kicker {
  font-family: '"IBM Plex Mono"', monospace;
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5b21e0;
}

.now-playing__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  color: #0b0a0e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.now-playing__artist {
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  color: #8a84a0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.now-playing__eq {
  display: flex;
  align-items: flex-end;
  gap: 2.5px;
  height: 18px;
  flex-shrink: 0;
  margin-left: 0.25rem;
}

.now-playing__eq-bar {
  width: 3px;
  height: 100%;
  background: #5b21e0;
  opacity: 0.75;
  transform-origin: bottom;
  transform: scaleY(var(--peak, 0.4));
  animation: eq-bounce 0.9s ease-in-out infinite alternate;
}

.now-playing__eq.is-paused .now-playing__eq-bar {
  opacity: 0.35;
}

@keyframes eq-bounce {
  0% { transform: scaleY(0.18); }
  100% { transform: scaleY(var(--peak, 0.4)); }
}

@media (prefers-reduced-motion: reduce) {
  .now-playing__eq-bar {
    animation: none;
  }
}
</style>
