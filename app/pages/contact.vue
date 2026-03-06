<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Contact | twinc1ty',
  description: 'Get in touch',
})

const contentRef = ref<HTMLElement>()

const links = [
  { label: 'GitHub', url: 'https://github.com/twinc1ty' },
  // { label: 'LinkedIn', url: 'https://linkedin.com/in/twinc1ty' },
  // { label: 'Twitter', url: 'https://twitter.com/twinc1ty' },
  { label: 'Email', url: 'mailto:cyberhybird@hotmail.com' },
  { label: 'Discord', url: 'https://discord.com/users/278592690566725632' },
]

onMounted(() => {
  gsap.from(contentRef.value!.children, {
    opacity: 0,
    y: 40,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div class="pt-24 pb-16 px-6 min-h-screen">
    <div ref="contentRef" class="max-w-4xl mx-auto text-center">
      <h1 class="section-heading neon-text mb-6">Contact</h1>

      <p class="text-cyber-muted mb-10 max-w-lg mx-auto font-sans">
        Have a project in mind or just want to chat? Feel free to reach out.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="px-6 py-3 border border-cyber-accent/15 text-cyber-accent/80 font-mono text-xs tracking-wider uppercase rounded hover:bg-cyber-accent/5 hover:border-cyber-accent/30 transition-all duration-500"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </div>
</template>
