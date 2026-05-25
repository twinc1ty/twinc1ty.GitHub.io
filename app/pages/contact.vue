<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Contact | twinc1ty',
  description: 'Get in touch',
})

const headingRef = ref<HTMLElement>()
const descRef = ref<HTMLElement>()
const chipsRef = ref<HTMLElement>()

const links = [
  { label: 'GitHub', url: 'https://github.com/twinc1ty' },
  { label: 'Email', url: 'mailto:cyberhybird@hotmail.com' },
  { label: 'Discord', url: 'https://discord.com/users/278592690566725632' },
]

onMounted(() => {
  gsap.from(headingRef.value!, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
  gsap.from(descRef.value!, { opacity: 0, y: 20, duration: 0.6, delay: 0.15, ease: 'power3.out' })
  if (chipsRef.value) {
    gsap.from(chipsRef.value.children, {
      y: 20, scale: 0.9, opacity: 0, stagger: 0.1, duration: 0.5,
      delay: 0.3, ease: 'power3.out', clearProps: 'all',
    })
  }
})
</script>

<template>
  <div class="pt-20 pb-20 px-6 min-h-screen">
    <div class="max-w-3xl mx-auto text-center">

      <div class="mb-10">
        <div class="flex items-center justify-center gap-3 mb-2">
          <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
            <path d="M5 0 L10 5 L5 10 L0 5Z" stroke="rgba(var(--cyber-accent-rgb),0.6)" stroke-width="1" />
          </svg>
          <span class="text-[9px] font-mono text-cyber-muted/50 tracking-[0.45em] uppercase">sys://signal</span>
          <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
            <path d="M5 0 L10 5 L5 10 L0 5Z" stroke="rgba(var(--cyber-accent-rgb),0.6)" stroke-width="1" />
          </svg>
        </div>
        <h1 ref="headingRef" class="section-heading neon-text">/signal</h1>
        <div class="mt-3 h-px w-48 mx-auto" style="background: linear-gradient(to right, transparent, rgba(var(--cyber-accent-rgb),0.4), transparent)" />
      </div>

      <p ref="descRef" class="text-cyber-muted mb-10 max-w-sm mx-auto font-sans text-sm leading-relaxed">
        Let's work on your next big project together.<br />Reach out via any platform below.
      </p>

      <!-- Ornamental divider -->
      <div class="flex items-center gap-4 mb-10">
        <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, rgba(var(--cyber-accent-rgb),0.2))" />
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <path d="M10 1 L19 10 L10 19 L1 10Z" stroke="rgba(var(--cyber-accent-rgb),0.4)" stroke-width="1" />
          <path d="M10 5 L15 10 L10 15 L5 10Z" stroke="rgba(var(--cyber-accent-rgb),0.25)" stroke-width="1" />
        </svg>
        <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, rgba(var(--cyber-accent-rgb),0.2))" />
      </div>

      <div ref="chipsRef" class="flex flex-wrap items-center justify-center gap-4">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-chip group"
        >
          <span class="text-cyber-accent/30 group-hover:text-cyber-accent/70 transition-colors duration-300 mr-2 font-mono text-[10px]">&gt;</span>
          {{ link.label }}
        </a>
      </div>
    </div>
  </div>
</template>
