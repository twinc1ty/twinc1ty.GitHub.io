<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'About | twinc1ty',
  description: 'Senior Software Engineer',
})

const headingRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()

onMounted(() => {
  gsap.from(headingRef.value!, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
  })

  gsap.from(panelRef.value!, {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.7,
    delay: 0.15,
    ease: 'power3.out',
    clearProps: 'transform',
  })
})
</script>

<template>
  <div class="pt-24 pb-16 px-6 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 ref="headingRef" class="section-heading neon-text mb-8">/identity</h1>

      <div ref="panelRef" class="cyber-folder">
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
            <p class="text-cyber-text-dim leading-relaxed font-sans">Who Am I?</p>
            <p class="text-cyber-muted leading-relaxed font-sans">
              An Artist. An Engineer.
            </p>
            <p class="text-cyber-muted leading-relaxed font-sans">
              Strong arts and design professional, with a Passion for Art, Pop
              Science, Music and Literature. I'm an artist, I draw and paint in a
              variety of styles including digital art as well.
            </p>
            <p class="text-cyber-muted leading-relaxed font-sans">
              Well in love with computers and computer science back when I was a
              kid, trying to play video games. I'm a startup enthusiast because I
              admire, cherish and absolutely dig the learning curve that startups
              have to offer.
            </p>
            <p class="text-cyber-muted leading-relaxed font-sans">
              Over the years I have worked on and delivered multiple
              projects as a freelance developer and an engineer. Strong technology
              and system design professional with a major in Computer Science.
            </p>
            <p class="text-cyber-muted leading-relaxed font-sans">
              I have immense love for art, pop science, music and literature. I love
              reading sci-fi and philosophies. My favorite book of all time is the
              Three Body Problem by Cixin Liu and the Foundation series by Isaac
              Asimov.
            </p>
            <p class="text-cyber-muted leading-relaxed font-sans">
              I want to be a better version of myself and a good human being.
            </p>
          </div>

          <div class="h-px bg-gradient-to-r from-cyber-accent/20 via-cyber-accent/5 to-transparent my-5" />

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in [
                'TypeScript',
                'Go',
                'Vue.js',
                'Nuxt',
                'React',
                'Firebase',
                'Retool',
                'Mixpanel',
                'Supabase',
                'PostgreSQL',
              ]"
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
  </div>
</template>
