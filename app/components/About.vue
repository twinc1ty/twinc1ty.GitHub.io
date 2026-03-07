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
      start: 'top 85%',
      once: true,
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

      <div class="cyber-folder">
        <div class="folder-tab">
          <span class="font-mono text-[10px] text-cyber-accent/70 tracking-widest">SYS://PROFILE</span>
        </div>

        <div class="folder-body">
          <div class="scanline-overlay" />

          <div class="flex items-center gap-2 mb-5">
            <div class="w-2 h-2 rounded-full bg-cyber-accent/50" />
            <div class="w-2 h-2 rounded-full bg-cyber-secondary/40" />
            <div class="w-2 h-2 rounded-full bg-cyber-subtle/40" />
            <span class="ml-2 text-[10px] font-mono text-cyber-subtle/60 tracking-wider">twinc1ty@portfolio ~ cat about.md</span>
          </div>

          <div class="space-y-4 pl-4 border-l-2 border-cyber-accent/10">
            <p class="text-cyber-text-dim leading-relaxed font-sans">
              Who am I?
              An Artist. An Engineer.
            </p>
            <p class="text-cyber-muted leading-relaxed font-sans">
              When I'm not coding, I'm exploring new technologies, contributing to open source,
              and writing about software engineering on my blog.
            </p>
          </div>

          <div class="h-px bg-gradient-to-r from-cyber-accent/20 via-cyber-accent/5 to-transparent my-5" />

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in ['TypeScript', 'Go', 'Python', 'Vue.js', 'Nuxt', 'Node.js', 'Docker', 'Kubernetes', 'AWS']"
              :key="tech"
              class="cyber-chip"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <div class="corner-accent top-left" />
        <div class="corner-accent bottom-right" />
      </div>
    </div>
  </section>
</template>
