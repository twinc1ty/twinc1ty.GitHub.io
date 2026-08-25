<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const socials = [
  { label: 'GitHub', url: 'https://github.com/twinc1ty' },
]

const footerRef = ref<HTMLElement>()
let observer: ResizeObserver | null = null

function publishHeight() {
  if (!footerRef.value) return
  document.documentElement.style.setProperty('--footer-h', `${footerRef.value.offsetHeight}px`)
}

onMounted(() => {
  publishHeight()
  observer = new ResizeObserver(publishHeight)
  if (footerRef.value) observer.observe(footerRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <footer ref="footerRef" class="fixed bottom-0 inset-x-0 z-50 border-t-2 border-cyber-text bg-cyber-dark">
    <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <svg viewBox="0 0 10 10" width="8" height="8" fill="none" class="shrink-0">
          <path d="M5 0 L10 5 L5 10 L0 5Z" fill="#5b21e0" />
        </svg>
        <p class="text-[11px] text-cyber-muted font-mono tracking-wider whitespace-nowrap">
          twinc1ty &copy; {{ new Date().getFullYear() }}
        </p>
      </div>

      <div class="flex items-center gap-5">
        <NuxtLink
          to="/blog"
          class="text-cyber-text hover:text-cyber-accent transition-colors text-[11px] font-mono uppercase tracking-widest"
        >
          Blog
        </NuxtLink>
        <a
          v-for="social in socials"
          :key="social.label"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-cyber-text hover:text-cyber-accent transition-colors text-[11px] font-mono uppercase tracking-widest"
        >
          {{ social.label }}
        </a>
      </div>
    </div>
  </footer>
</template>
