<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import projectData from '../../public/data/projects.json'
const featured = computed(() => (projectData?.repos || []).slice(0, 3))

const sectionRef = ref<HTMLElement>()
const cardsRef = ref<HTMLElement>()

onMounted(() => {
  if (!cardsRef.value) return
  gsap.from(cardsRef.value.children, {
    scrollTrigger: {
      trigger: sectionRef.value!,
      start: 'top 80%',
    },
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
    clearProps: 'all',
  })
})
</script>

<template>
  <section v-if="featured.length" ref="sectionRef" class="py-24 px-6 bg-cyber-dark">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <p class="page-kicker">Constructs</p>
          <h2 class="section-heading neon-text">Featured Work</h2>
        </div>
        <NuxtLink
          to="/projects"
          class="text-xs font-mono uppercase tracking-widest text-cyber-accent hover:text-cyber-text transition-colors"
        >
          View all work →
        </NuxtLink>
      </div>

      <div ref="cardsRef" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProjectCard
          v-for="(repo, i) in featured"
          :key="repo.name"
          :name="repo.name"
          :description="repo.description"
          :stars="repo.stars"
          :language="repo.language"
          :url="repo.url"
          :index="i"
        />
      </div>
    </div>
  </section>
</template>
