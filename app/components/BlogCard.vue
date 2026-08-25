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
    class="deck-card group"
  >
    <!-- Date bar -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="font-mono text-[10px] text-cyber-accent tracking-widest">{{ padIndex }}</span>
        <span class="text-[11px] font-mono text-cyber-muted tracking-wider">{{ formatDate(date) }}</span>
      </div>
      <span class="text-[10px] font-mono text-cyber-accent tracking-wider">
        Read →
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-display font-black text-lg text-cyber-text group-hover:text-cyber-accent transition-colors duration-200 mb-3 truncate uppercase">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-cyber-text-dim mb-4 line-clamp-2 font-sans leading-relaxed">
      {{ description }}
    </p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1.5 border-t-2 border-cyber-subtle pt-3">
      <span
        v-for="tag in tags"
        :key="tag"
        class="px-2 py-0.5 text-[10px] font-mono text-cyber-muted border border-cyber-subtle"
      >
        #{{ tag }}
      </span>
    </div>
  </NuxtLink>
</template>
