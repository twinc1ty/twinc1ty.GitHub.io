<script setup lang="ts">
defineProps<{
  name: string
  description: string
  stars: number
  language: string
  url: string
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
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="glass-panel neon-border p-6 block group transition-all duration-300 hover:-translate-y-1"
  >
    <div class="flex items-start justify-between mb-3">
      <h3 class="font-mono text-lg text-cyber-text group-hover:text-cyber-accent transition-colors">
        {{ name }}
      </h3>
      <svg class="w-5 h-5 text-cyber-subtle group-hover:text-cyber-accent transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </div>

    <p class="text-sm text-cyber-muted mb-4 line-clamp-2">
      {{ description || 'No description available' }}
    </p>

    <div class="flex items-center gap-4 text-xs text-cyber-subtle font-mono">
      <span v-if="language" class="flex items-center gap-1.5">
        <span
          class="w-2.5 h-2.5 rounded-full"
          :style="{ backgroundColor: langColors[language] || '#666' }"
        />
        {{ language }}
      </span>
      <span v-if="stars > 0" class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {{ stars }}
      </span>
    </div>
  </a>
</template>
