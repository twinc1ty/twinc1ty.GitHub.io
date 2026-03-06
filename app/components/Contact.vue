<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()

const links = [
  { label: 'GitHub', url: 'https://github.com/twinc1ty' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/twinc1ty' },
  { label: 'Twitter', url: 'https://twitter.com/twinc1ty' },
  { label: 'Email', url: 'mailto:hello@twinc1ty.dev' },
]

onMounted(() => {
  gsap.from(sectionRef.value!, {
    scrollTrigger: {
      trigger: sectionRef.value!,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="section-heading neon-text mb-6">
        <span class="text-cyber-subtle text-sm font-mono font-normal mr-3">04</span>
        Contact
      </h2>

      <p class="text-cyber-muted mb-10 max-w-lg mx-auto">
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
  </section>
</template>
