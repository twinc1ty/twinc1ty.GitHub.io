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
      class="fixed top-6 right-6 z-[60] group flex items-center gap-3"
    >
      <span class="text-[10px] font-mono text-cyber-muted uppercase tracking-[0.3em] group-hover:text-cyber-accent transition-colors duration-300">
        menu
      </span>
      <div class="flex flex-col gap-[5px]">
        <span class="block w-6 h-px bg-cyber-muted/60 group-hover:bg-cyber-accent transition-all duration-300 group-hover:w-5 origin-right" />
        <span class="block w-4 h-px bg-cyber-muted/60 group-hover:bg-cyber-accent transition-all duration-300 group-hover:w-6" />
      </div>
    </NuxtLink>
  </template>
</template>
