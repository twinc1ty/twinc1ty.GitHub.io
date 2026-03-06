<script setup lang="ts">
const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const isScrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono',
      isScrolled ? 'bg-cyber-dark/90 backdrop-blur-md border-b border-cyber-accent/5' : 'bg-transparent',
    ]"
  >
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="text-lg font-display font-bold neon-text tracking-widest uppercase">
        twinc1ty
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="text-xs text-cyber-muted hover:text-cyber-accent transition-colors duration-300 relative group font-mono tracking-wider uppercase"
        >
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-px bg-cyber-accent/50 transition-all duration-300 group-hover:w-full" />
        </NuxtLink>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden text-cyber-muted hover:text-cyber-accent"
        @click="mobileOpen = !mobileOpen"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!mobileOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide">
      <div
        v-if="mobileOpen"
        class="md:hidden bg-cyber-dark/95 backdrop-blur-md border-b border-cyber-accent/5 px-6 pb-4"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="block py-2 text-xs text-cyber-muted hover:text-cyber-accent transition-colors font-mono tracking-wider uppercase"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
