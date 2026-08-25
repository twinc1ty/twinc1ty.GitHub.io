<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'About | twinc1ty',
  description: 'Senior Software Engineer',
})

const headingRef = ref<HTMLElement>()
const ruleRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()

const tech = ['TypeScript', 'Go', 'Vue.js', 'Nuxt', 'React', 'Firebase', 'Retool', 'Mixpanel', 'Supabase', 'PostgreSQL']

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(headingRef.value!, { opacity: 0, y: 30, duration: 0.7, clearProps: 'all' })
    .from(ruleRef.value!, { scaleX: 0, duration: 0.5, ease: 'power4.inOut' }, 0.25)
    .from(panelRef.value!, { opacity: 0, y: 30, duration: 0.6, clearProps: 'all' }, 0.35)
})
</script>

<template>
  <div class="page-shell">
    <div class="max-w-3xl mx-auto">
      <div class="mb-12">
        <p class="page-kicker">Identity</p>
        <h1 ref="headingRef" class="page-title">About</h1>
        <div ref="ruleRef" class="page-rule" />
      </div>

      <div ref="panelRef" class="deck-card">
        <p class="about-page__lead">Who am I? An artist. An engineer.</p>

        <div class="about-page__body">
          <p>Strong arts and design professional, with a passion for art, pop science, music and literature. I draw and paint in a variety of styles including digital art.</p>
          <p>In love with computers and computer science since I was a kid. Startup enthusiast — I admire the learning curve that startups have to offer.</p>
          <p>Worked on and delivered multiple projects as a freelance developer and engineer. Strong technology and system design professional with a major in Computer Science.</p>
          <p>My favorite books: Three Body Problem by Cixin Liu and the Foundation series by Isaac Asimov.</p>
          <p>I want to be a better version of myself and a good human being.</p>
        </div>

        <div class="about-page__divider" />

        <div class="flex flex-wrap gap-2">
          <span v-for="t in tech" :key="t" class="cyber-chip">{{ t }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page__lead {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 1.4rem;
  color: #0b0a0e;
  margin-bottom: 1.5rem;
}

.about-page__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Manrope', sans-serif;
  font-size: 1.05rem;
  line-height: 1.7;
  color: #34313c;
}

.about-page__divider {
  height: 2px;
  background: #e1daf5;
  margin: 2rem 0 1.5rem;
}
</style>
