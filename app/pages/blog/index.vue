<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Blog | twinc1ty',
  description: 'Documenting my journey as an Engineer',
})

const cardsRef = ref<HTMLElement>()

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()
)

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
    <div class="max-w-4xl mx-auto">

      <div class="mb-12">
        <div class="flex items-center gap-3 mb-2">
          <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
            <path d="M5 0 L10 5 L5 10 L0 5Z" stroke="rgba(var(--cyber-accent-rgb),0.6)" stroke-width="1" />
          </svg>
          <span class="text-[9px] font-mono text-cyber-muted/50 tracking-[0.45em] uppercase">sys://logs</span>
        </div>
        <h1 class="section-heading neon-text">/logs</h1>
        <div class="mt-3 h-px w-full" style="background: linear-gradient(to right, rgba(var(--cyber-accent-rgb),0.4), transparent)" />
      </div>

      <div ref="cardsRef" class="space-y-5" style="perspective: 1000px">
        <BlogCard
          v-for="(post, i) in posts"
          :key="post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :tags="post.tags"
          :slug="post.path?.replace('/blog/', '') || ''"
          :index="i"
        />
      </div>

      <div v-if="!posts?.length" class="text-center text-cyber-muted font-mono py-12">
        No blog posts yet.
      </div>
    </div>
  </div>
</template>
