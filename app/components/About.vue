<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()

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
  <section id="about" ref="sectionRef" class="py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <h2 class="section-heading neon-text mb-8">
        <span class="text-cyber-subtle text-sm font-mono font-normal mr-3">01</span>
        About
      </h2>

      <div class="glass-panel p-8 space-y-4">
        <p class="text-cyber-text-dim leading-relaxed">
          Who am I?
          An Artist. An Engineer
        </p>
        <p class="text-cyber-muted leading-relaxed">
          When I'm not coding, I'm exploring new technologies, contributing to open source,
          and writing about software engineering on my blog.
        </p>

        <div class="pt-4 flex flex-wrap gap-2">
          <span
            v-for="tech in ['TypeScript', 'Go', 'Python', 'Vue.js', 'Nuxt', 'Node.js', 'Docker', 'Kubernetes', 'AWS']"
            :key="tech"
            class="px-3 py-1 text-xs font-mono text-cyber-accent/80 bg-cyber-accent/5 border border-cyber-accent/10 rounded"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
