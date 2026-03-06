<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()

const { data: posts } = await useAsyncData('blog-preview', () =>
  queryCollection('blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .limit(3)
    .all()
)

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
})
</script>

<template>
  <section id="blog" ref="sectionRef" class="py-24 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-12">
        <h2 class="section-heading neon-text">
          <span class="text-cyber-subtle text-sm font-mono font-normal mr-3">03</span>
          Blog
        </h2>
        <NuxtLink
          to="/blog"
          class="text-xs font-mono text-cyber-subtle hover:text-cyber-accent transition-colors tracking-wider"
        >
          View all &rarr;
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard
          v-for="post in posts"
          :key="post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :tags="post.tags"
          :slug="post.path?.replace('/blog/', '') || ''"
        />
      </div>

      <div v-if="!posts?.length" class="text-center text-cyber-muted font-mono py-12">
        No blog posts yet. Check back soon.
      </div>
    </div>
  </section>
</template>
