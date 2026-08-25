<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Projects | twinc1ty',
  description: 'Projects and repositories',
})

const headingRef = ref<HTMLElement>()
const ruleRef = ref<HTMLElement>()
const cardsRef = ref<HTMLElement>()

import projectData from '../../public/data/projects.json'
const repos = computed(() => projectData?.repos || [])

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(headingRef.value!, { opacity: 0, y: 30, duration: 0.7, clearProps: 'all' })
    .from(ruleRef.value!, { scaleX: 0, duration: 0.5, ease: 'power4.inOut' }, 0.25)

  if (cardsRef.value) {
    tl.from(cardsRef.value.children, {
      opacity: 0, y: 40, stagger: 0.08, duration: 0.55, ease: 'power3.out', clearProps: 'all',
    }, 0.35)
  }
})
</script>

<template>
  <div class="page-shell">
    <div class="max-w-6xl mx-auto">
      <div class="mb-12">
        <p class="page-kicker">Constructs</p>
        <h1 ref="headingRef" class="page-title">Work</h1>
        <div ref="ruleRef" class="page-rule" />
      </div>

      <div ref="cardsRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
