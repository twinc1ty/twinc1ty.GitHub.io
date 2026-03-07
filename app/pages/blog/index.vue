<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Blog | twinc1ty',
  description: 'Thoughts on software engineering, architecture, and tech',
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
  <div class="pt-16 pb-16 px-6 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="section-heading neon-text mb-12">/logs</h1>

      <div ref="cardsRef" class="space-y-6" style="perspective: 1000px">
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
