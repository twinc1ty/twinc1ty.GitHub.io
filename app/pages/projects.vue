<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Projects | twinc1ty',
  description: 'Projects and repositories',
})

const cardsRef = ref<HTMLElement>()

import projectData from '../../public/data/projects.json'
const repos = computed(() => projectData?.repos || [])

onMounted(() => {
  if (cardsRef.value) {
    gsap.from(cardsRef.value.children, {
      opacity: 0, y: 50, scale: 0.94, stagger: 0.1, duration: 0.65, ease: 'power3.out', clearProps: 'transform',
    })
  }
})
</script>

<template>
  <div class="pt-20 pb-20 px-6 min-h-screen">
    <div class="max-w-6xl mx-auto">

      <div class="mb-12">
        <div class="flex items-center gap-3 mb-2">
          <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
            <path d="M5 0 L10 5 L5 10 L0 5Z" stroke="rgba(var(--cyber-accent-rgb),0.6)" stroke-width="1" />
          </svg>
          <span class="text-[9px] font-mono text-cyber-muted/50 tracking-[0.45em] uppercase">sys://constructs</span>
        </div>
        <h1 class="section-heading neon-text">/constructs</h1>
        <div class="mt-3 h-px w-full" style="background: linear-gradient(to right, rgba(var(--cyber-accent-rgb),0.4), transparent)" />
      </div>

      <div ref="cardsRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style="perspective: 1000px">
        <ProjectCard
          v-for="(repo, i) in repos"
          :key="repo.name"
          :name="repo.name"
          :description="repo.description"
          :stars="repo.stars"
          :language="repo.language"
          :url="repo.url"
          :index="i"
        />
      </div>

      <div v-if="!repos.length" class="text-center text-cyber-muted font-mono py-12">
        No projects configured yet.
      </div>
    </div>
  </div>
</template>
