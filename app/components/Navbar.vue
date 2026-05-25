<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <template v-if="!isHome">
    <!-- Wordmark — left -->
    <NuxtLink
      to="/"
      class="fixed top-6 left-6 z-[60] flex items-center gap-2 group"
    >
      <svg viewBox="0 0 10 10" width="8" height="8" fill="none" class="opacity-40 group-hover:opacity-80 transition-opacity duration-300">
        <path d="M5 0 L10 5 L5 10 L0 5Z" stroke="rgba(var(--cyber-accent-rgb),1)" stroke-width="1.5" />
      </svg>
      <span class="text-[9px] font-mono text-cyber-muted/55 group-hover:text-cyber-accent transition-colors duration-300 tracking-[0.4em] uppercase">twinc1ty</span>
    </NuxtLink>

    <!-- Back link — right -->
    <NuxtLink
      to="/"
      class="fixed top-6 right-6 z-[60] group flex items-center gap-2"
    >
      <span class="text-[9px] font-mono text-cyber-muted/55 uppercase tracking-[0.35em] group-hover:text-cyber-accent transition-colors duration-300">
        home
      </span>
      <!-- Small diamond separator -->
      <svg viewBox="0 0 8 8" width="6" height="6" fill="none" class="opacity-30 group-hover:opacity-70 transition-opacity duration-300">
        <path d="M4 0 L8 4 L4 8 L0 4Z" stroke="rgba(var(--cyber-accent-rgb),1)" stroke-width="1" />
      </svg>
    </NuxtLink>
  </template>
</template>
