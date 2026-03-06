<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { isAuthenticated } = useGithubAuth()
</script>

<template>
  <div>
    <h1 class="text-2xl font-display font-bold text-cyber-text mb-8">Admin Dashboard</h1>

    <AdminLogin class="mb-8" />

    <div v-if="isAuthenticated" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          to="/admin/projects"
          class="glass-panel neon-border p-6 block group transition-all hover:-translate-y-1"
        >
          <h3 class="font-mono text-lg text-cyber-text group-hover:text-cyber-accent transition-colors mb-2">
            Manage Projects
          </h3>
          <p class="text-sm text-cyber-muted">
            Select and reorder which GitHub repos appear on your portfolio.
          </p>
        </NuxtLink>

        <a
          href="https://nuxt.studio"
          target="_blank"
          rel="noopener noreferrer"
          class="glass-panel neon-border p-6 block group transition-all hover:-translate-y-1"
        >
          <h3 class="font-mono text-lg text-cyber-text group-hover:text-cyber-secondary transition-colors mb-2">
            Manage Blog
            <span class="text-xs text-cyber-subtle font-normal ml-2">External</span>
          </h3>
          <p class="text-sm text-cyber-muted">
            Create and edit blog posts using Nuxt Studio's visual editor.
          </p>
        </a>
      </div>
    </div>
  </div>
</template>
