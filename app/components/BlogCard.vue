<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  date: string
  tags: string[]
  slug: string
  index?: number
}>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const padIndex = computed(() => String((props.index ?? 0) + 1).padStart(2, '0'))
</script>

<template>
  <NuxtLink
    :to="`/blog/${slug}`"
    class="cyber-folder group block relative"
  >
    <!-- Folder tab -->
    <div class="folder-tab">
      <span class="font-mono text-[10px] text-cyber-accent/70 tracking-widest">LOG://{{ padIndex }}</span>
    </div>

    <!-- Main folder body -->
    <div class="folder-body">
      <div class="scanline-overlay" />

      <!-- Date bar -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-cyber-secondary/50" />
          <span class="text-[11px] font-mono text-cyber-subtle tracking-wider">{{ formatDate(date) }}</span>
        </div>
        <span class="text-[10px] font-mono text-cyber-accent/30 group-hover:text-cyber-accent/60 transition-colors duration-300 tracking-wider">
          READ →
        </span>
      </div>

      <!-- Title -->
      <h3 class="font-mono text-base text-cyber-text group-hover:text-cyber-accent transition-colors duration-300 mb-2 truncate">
        <span class="text-cyber-accent/40 mr-1">&gt;</span>{{ title }}
      </h3>

      <!-- Divider -->
      <div class="h-px bg-gradient-to-r from-cyber-accent/20 via-cyber-accent/5 to-transparent mb-3 group-hover:from-cyber-accent/40 transition-all duration-500" />

      <!-- Description -->
      <p class="text-xs text-cyber-muted mb-4 line-clamp-2 font-sans leading-relaxed">
        {{ description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-2 py-0.5 text-[10px] font-mono text-cyber-secondary/60 border border-cyber-secondary/10 rounded-sm bg-cyber-secondary/5"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- Corner accents -->
    <div class="corner-accent top-left" />
    <div class="corner-accent bottom-right" />
  </NuxtLink>
</template>
