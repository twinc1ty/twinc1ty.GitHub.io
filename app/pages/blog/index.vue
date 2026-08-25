<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Blog | twinc1ty',
  description: 'Documenting my journey as an Engineer',
})

const headingRef = ref<HTMLElement>()
const ruleRef = ref<HTMLElement>()
const cardsRef = ref<HTMLElement>()

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()
)

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
    <div class="max-w-3xl mx-auto">
      <div class="mb-12">
        <p class="page-kicker">Logs</p>
        <h1 ref="headingRef" class="page-title">Blog</h1>
        <div ref="ruleRef" class="page-rule" />
      </div>

      <div ref="cardsRef" class="space-y-5">
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
