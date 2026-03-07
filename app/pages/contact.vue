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
  gsap.from(headingRef.value!, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
  })

  gsap.from(descRef.value!, {
    opacity: 0,
    y: 40,
    duration: 0.7,
    delay: 0.1,
    ease: 'power3.out',
  })

  if (chipsRef.value) {
    gsap.from(chipsRef.value.children, {
      y: 20,
      scale: 0.9,
      stagger: 0.08,
      duration: 0.5,
      delay: 0.25,
      ease: 'power3.out',
      clearProps: 'transform',
    })
  }
})
</script>

<template>
  <div class="pt-16 pb-16 px-6 min-h-screen">
    <div class="max-w-4xl mx-auto text-center">
      <h1 ref="headingRef" class="section-heading neon-text mb-6">/signal</h1>

      <p ref="descRef" class="text-cyber-muted mb-10 max-w-lg mx-auto font-sans">
        Let's work on your next big project together. Reach out to me via any of the platforms below.
      </p>

      <div ref="chipsRef" class="flex flex-wrap items-center justify-center gap-4">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-chip group"
        >
          <span class="text-cyber-accent/30 group-hover:text-cyber-accent/60 transition-colors duration-300 mr-2 font-mono text-[10px]">&gt;</span>
          {{ link.label }}
        </a>
      </div>
    </div>
  </div>
</template>
