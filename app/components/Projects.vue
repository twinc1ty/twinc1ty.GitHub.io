<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Repo {
  owner: string
  name: string
  description: string
  stars: number
  language: string
  url: string
}

const sectionRef = ref<HTMLElement>()
const cardsRef = ref<HTMLElement>()

const { data: projectData } = await useAsyncData('projects', () =>
  $fetch<{ repos: Repo[] }>('/data/projects.json')
)
const repos = computed(() => projectData.value?.repos || [])

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

  if (cardsRef.value) {
    gsap.from(cardsRef.value.children, {
      scrollTrigger: {
        trigger: cardsRef.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    })
  }
})
</script>

<template>
  <section id="projects" ref="sectionRef" class="py-24 px-6">
    <div class="max-w-6xl mx-auto">
      <h2 class="section-heading neon-text mb-12">
        <span class="text-cyber-subtle text-sm font-mono font-normal mr-3">02</span>
        Projects
      </h2>

      <div
        ref="cardsRef"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ProjectCard
          v-for="repo in repos"
          :key="repo.name"
          :name="repo.name"
          :description="repo.description"
          :stars="repo.stars"
          :language="repo.language"
          :url="repo.url"
        />
      </div>

      <div v-if="!repos.length" class="text-center text-cyber-muted font-mono py-12">
        No projects configured yet.
      </div>
    </div>
  </section>
</template>
