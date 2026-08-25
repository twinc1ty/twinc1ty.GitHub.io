<script setup lang="ts">
const props = defineProps<{
  name: string
  description: string
  stars: number
  language: string
  url: string
  index: number
}>()

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Vue: '#41b883',
  Rust: '#dea584',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

const padIndex = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="deck-card group"
  >
    <!-- Top bar -->
    <div class="flex items-center justify-between mb-4">
      <span class="font-mono text-[10px] text-cyber-accent tracking-widest">{{ padIndex }}</span>
      <svg class="w-4 h-4 text-cyber-muted group-hover:text-cyber-accent transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </div>

    <!-- Project name -->
    <h3 class="font-display font-black text-lg text-cyber-text group-hover:text-cyber-accent transition-colors duration-200 mb-2 truncate uppercase">
      {{ name }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-cyber-text-dim mb-5 line-clamp-2 font-sans leading-relaxed">
      {{ description || 'No description available' }}
    </p>

    <!-- Bottom metadata -->
    <div class="flex items-center justify-between text-[11px] font-mono border-t-2 border-cyber-subtle pt-3">
      <div class="flex items-center gap-3">
        <span v-if="language" class="flex items-center gap-1.5">
          <span
            class="w-2 h-2 rounded-full ring-1 ring-cyber-text/15"
            :style="{ backgroundColor: langColors[language] || '#666' }"
          />
          <span class="text-cyber-muted">{{ language }}</span>
        </span>
        <span v-if="stars > 0" class="flex items-center gap-1 text-cyber-muted">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {{ stars }}
        </span>
      </div>
      <span class="text-cyber-accent tracking-wider">
        Open →
      </span>
    </div>
  </a>
</template>
