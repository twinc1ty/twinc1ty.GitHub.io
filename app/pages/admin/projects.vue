<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { isAuthenticated } = useGithubAuth()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-display font-bold text-cyber-text">Manage Projects</h1>
      <NuxtLink to="/admin" class="text-sm font-mono text-cyber-subtle hover:text-cyber-accent transition-colors">
        &larr; Back
      </NuxtLink>
    </div>

    <AdminLogin v-if="!isAuthenticated" />
    <AdminProjectManager v-else />
  </div>
</template>
