<script setup lang="ts">
const socials = [
  { label: 'GitHub', url: 'https://github.com/twinc1ty', icon: 'github' },
  // { label: 'LinkedIn', url: 'https://linkedin.com/in/twinc1ty', icon: 'linkedin' },
  // { label: 'Twitter', url: 'https://twitter.com/twinc1ty', icon: 'twitter' },
]
</script>

<template>
  <footer class="border-t border-cyber-accent/5 bg-cyber-darker/30">
    <div class="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-xs text-cyber-subtle font-mono tracking-wider">
        &copy; {{ new Date().getFullYear() }} twinc1ty
      </p>

      <div class="flex items-center gap-6">
        <a
          v-for="social in socials"
          :key="social.icon"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-cyber-subtle hover:text-cyber-accent transition-colors text-xs font-mono tracking-wider"
        >
          {{ social.label }}
        </a>
      </div>
    </div>
  </footer>
</template>
