<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <template v-if="!isHome">
    <NuxtLink
      to="/"
      class="fixed top-6 left-6 z-[60] text-[10px] font-mono text-cyber-muted/60 hover:text-cyber-accent transition-colors duration-300 tracking-[0.3em] uppercase"
    >
      twinc1ty
    </NuxtLink>

    <NuxtLink
      to="/"
      class="fixed top-6 right-6 z-[60] group flex items-center gap-2"
    >
      <span class="text-[10px] font-mono text-cyber-muted uppercase tracking-[0.3em] group-hover:text-cyber-accent transition-colors duration-300">
        back
      </span>
      <svg
        class="w-3 h-3 text-cyber-muted/60 group-hover:text-cyber-accent transition-colors duration-300 rotate-180"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </NuxtLink>
  </template>
</template>
