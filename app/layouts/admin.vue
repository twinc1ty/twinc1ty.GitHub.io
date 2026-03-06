<template>
  <div class="min-h-screen bg-cyber-dark">
    <nav class="border-b border-cyber-accent/5 bg-cyber-darker/80">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-xs font-mono text-cyber-subtle hover:text-cyber-accent transition-colors">
            &larr; Site
          </NuxtLink>
          <span class="text-cyber-surface-light">|</span>
          <span class="text-xs font-mono neon-text">Admin</span>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/admin"
            class="text-xs font-mono text-cyber-muted hover:text-cyber-accent transition-colors"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/projects"
            class="text-xs font-mono text-cyber-muted hover:text-cyber-accent transition-colors"
          >
            Projects
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-5xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>
