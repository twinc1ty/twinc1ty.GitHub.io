<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="min-h-screen relative">
    <ParticleBackground v-if="!isHome" />
    <Navbar />
    <main class="relative z-10">
      <slot />
    </main>
  </div>
</template>
