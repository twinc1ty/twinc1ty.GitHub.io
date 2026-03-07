<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()
const chipsRef = ref<HTMLElement>()

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
      start: 'top 85%',
      once: true,
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
  })

  if (chipsRef.value) {
    gsap.from(chipsRef.value.children, {
      scrollTrigger: {
        trigger: chipsRef.value,
        start: 'top 90%',
        once: true,
      },
      y: 20,
      scale: 0.9,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power3.out',
      clearProps: 'transform',
    })
  }
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="section-heading neon-text mb-6">
        <span class="text-cyber-subtle text-sm font-mono font-normal mr-3">04</span>
        Contact
      </h2>

      <p class="text-cyber-muted mb-10 max-w-lg mx-auto font-sans">
        Have a project in mind or just want to chat? Feel free to reach out.
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
  </section>
</template>
