<script setup lang="ts">
defineProps<{
  title: string
  description: string
  date: string
  tags: string[]
  slug: string
}>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <NuxtLink
    :to="`/blog/${slug}`"
    class="glass-panel neon-border p-6 block group transition-all duration-300 hover:-translate-y-1"
  >
    <div class="flex items-center gap-2 mb-3">
      <span class="text-xs font-mono text-cyber-subtle">{{ formatDate(date) }}</span>
    </div>

    <h3 class="font-mono text-lg text-cyber-text group-hover:text-cyber-accent transition-colors mb-2">
      {{ title }}
    </h3>

    <p class="text-sm text-cyber-muted mb-4 line-clamp-2">
      {{ description }}
    </p>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="px-2 py-0.5 text-xs font-mono text-cyber-secondary/60 bg-cyber-secondary/5 border border-cyber-secondary/10 rounded"
      >
        #{{ tag }}
      </span>
    </div>
  </NuxtLink>
</template>
