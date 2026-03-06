<script setup lang="ts">
useSeoMeta({
  title: 'Blog | twinc1ty',
  description: 'Thoughts on software engineering, architecture, and tech',
})

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <div class="pt-24 pb-16 px-6 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="section-heading neon-text mb-12">Blog</h1>

      <div class="space-y-6">
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
        No blog posts yet.
      </div>
    </div>
  </div>
</template>
