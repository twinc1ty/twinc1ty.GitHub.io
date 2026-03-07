<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Projects | twinc1ty',
  description: 'Open source projects and repositories',
})

interface Repo {
  owner: string
  name: string
  description: string
  stars: number
  language: string
  url: string
}

const cardsRef = ref<HTMLElement>()

const { data: projectData } = await useAsyncData('projects', () =>
  $fetch<{ repos: Repo[] }>('/data/projects.json')
)
const repos = computed(() => projectData.value?.repos || [])

onMounted(() => {
  if (cardsRef.value) {
    gsap.from(cardsRef.value.children, {
      opacity: 0,
      y: 50,
      scale: 0.92,
      rotateX: 8,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'transform',
    })
  }
})
</script>

<template>
  <div class="pt-24 pb-16 px-6 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <h1 class="section-heading neon-text mb-12">/constructs</h1>

      <div
        ref="cardsRef"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style="perspective: 1000px"
      >
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
