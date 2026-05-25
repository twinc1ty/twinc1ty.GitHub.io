<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'About | twinc1ty',
  description: 'Senior Software Engineer',
})

const headingRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const ornRef = ref<HTMLElement>()

onMounted(() => {
  gsap.from(headingRef.value!, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
  gsap.from(ornRef.value!, { opacity: 0, scaleX: 0, duration: 0.6, delay: 0.2, ease: 'power2.inOut' })
  gsap.from(panelRef.value!, { opacity: 0, y: 40, scale: 0.97, duration: 0.7, delay: 0.25, ease: 'power3.out', clearProps: 'transform' })
})
</script>

<template>
  <div class="pt-20 pb-20 px-6 min-h-screen">
    <div class="max-w-4xl mx-auto">

      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
            <path d="M5 0 L10 5 L5 10 L0 5Z" stroke="rgba(var(--cyber-accent-rgb),0.6)" stroke-width="1" />
          </svg>
          <span class="text-[9px] font-mono text-cyber-muted/50 tracking-[0.45em] uppercase">sys://profile</span>
        </div>
        <h1 ref="headingRef" class="section-heading neon-text">/identity</h1>
        <div ref="ornRef" class="mt-3 h-px w-full origin-left" style="background: linear-gradient(to right, rgba(var(--cyber-accent-rgb),0.4), transparent)" />
      </div>

      <div ref="panelRef" class="cyber-folder">
        <div class="folder-tab">
          <span class="font-mono text-[9px] text-cyber-accent/60 tracking-[0.3em] uppercase">twinc1ty@portfolio ~ cat about.md</span>
        </div>
        <div class="folder-body">
          <div class="scanline-overlay" />
          <div class="space-y-4 pl-4 border-l border-cyber-accent/12">
            <p class="text-cyber-text-dim leading-relaxed font-sans">Who Am I?</p>
            <p class="text-cyber-muted leading-relaxed font-sans">An Artist. An Engineer.</p>
            <p class="text-cyber-muted leading-relaxed font-sans text-sm">Strong arts and design professional, with a passion for Art, Pop Science, Music and Literature. I draw and paint in a variety of styles including digital art.</p>
            <p class="text-cyber-muted leading-relaxed font-sans text-sm">In love with computers and computer science since I was a kid. Startup enthusiast — I admire the learning curve that startups have to offer.</p>
            <p class="text-cyber-muted leading-relaxed font-sans text-sm">Worked on and delivered multiple projects as a freelance developer and engineer. Strong technology and system design professional with a major in Computer Science.</p>
            <p class="text-cyber-muted leading-relaxed font-sans text-sm">My favorite books: Three Body Problem by Cixin Liu and the Foundation series by Isaac Asimov.</p>
            <p class="text-cyber-muted leading-relaxed font-sans text-sm">I want to be a better version of myself and a good human being.</p>
          </div>
          <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, rgba(var(--cyber-accent-rgb),0.2))" />
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
              <path d="M6 0 L12 6 L6 12 L0 6Z" stroke="rgba(var(--cyber-accent-rgb),0.45)" stroke-width="1" />
            </svg>
            <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, rgba(var(--cyber-accent-rgb),0.2))" />
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in ['TypeScript','Go','Vue.js','Nuxt','React','Firebase','Retool','Mixpanel','Supabase','PostgreSQL']" :key="tech" class="cyber-chip">{{ tech }}</span>
          </div>
        </div>
        <div class="corner-accent top-left" />
        <div class="corner-accent bottom-right" />
      </div>
    </div>
  </div>
</template>
