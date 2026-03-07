<script setup lang="ts">
import gsap from "gsap";

useSeoMeta({
  title: "About | twinc1ty",
  description: "Senior Software Engineer",
});

const contentRef = ref<HTMLElement>();

onMounted(() => {
  gsap.from(contentRef.value!.children, {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.8,
    ease: "power3.out",
  });
});
</script>

<template>
  <div class="pt-24 pb-16 px-6 min-h-screen">
    <div ref="contentRef" class="max-w-4xl mx-auto">
      <h1 class="section-heading neon-text mb-8">About</h1>

      <div class="glass-panel p-8 space-y-4">
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
          I
          have immense love for art, pop science, music and literature. I love
          reading sci-fi and philosophies. My favorite book of all time is the
          Three Body Problem by Cixin Liu and the Foundation series by Isaac
          Asimov. 
          </p>
          <p class="text-cyber-muted leading-relaxed font-sans">
          I want to be a better version of myself and a good human
          being.</p>
        <div class="pt-4 flex flex-wrap gap-2">
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
            class="px-3 py-1 text-xs font-mono text-cyber-accent/80 bg-cyber-accent/5 border border-cyber-accent/10 rounded"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
