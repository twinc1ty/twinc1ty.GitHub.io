<script setup lang="ts">
const route = useRoute()
const slug = (route.params.slug as string[]).join('/')

const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first()
)

useSeoMeta({
  title: () => post.value ? `${post.value.title} | twinc1ty` : 'Blog | twinc1ty',
  description: () => post.value?.description || '',
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="pt-24 pb-16 px-6 min-h-screen">
    <article v-if="post" class="max-w-3xl mx-auto">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-1 text-sm font-mono text-cyber-subtle hover:text-cyber-accent transition-colors mb-8"
      >
        &larr; Back to blog
      </NuxtLink>

      <header class="mb-12">
        <h1 class="text-3xl md:text-5xl font-display font-bold text-cyber-text mb-4">
          {{ post.title }}
        </h1>
        <div class="flex items-center gap-4 text-sm text-cyber-subtle font-mono">
          <span>{{ formatDate(post.date) }}</span>
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-2 py-0.5 text-xs font-mono text-cyber-secondary/60 bg-cyber-secondary/5 border border-cyber-secondary/10 rounded"
          >
            #{{ tag }}
          </span>
        </div>
      </header>

      <div class="blog-content max-w-none">
        <ContentRenderer :value="post" />
      </div>
    </article>

    <div v-else class="max-w-3xl mx-auto text-center py-24">
      <p class="text-cyber-muted font-mono">Post not found.</p>
      <NuxtLink to="/blog" class="text-cyber-accent font-mono text-sm mt-4 inline-block">
        &larr; Back to blog
      </NuxtLink>
    </div>
  </div>
</template>

<style>
.blog-content {
  @apply text-cyber-text-dim font-sans;
  line-height: 1.8;
}
.blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
  @apply text-cyber-text font-display tracking-wider uppercase;
}
.blog-content h2 {
  @apply text-2xl mt-10 mb-4;
  color: #7aa2f7;
  text-shadow: 0 0 10px #7aa2f744;
}
.blog-content h3 {
  @apply text-xl mt-8 mb-3;
}
.blog-content p {
  @apply text-cyber-text-dim leading-relaxed mb-4 font-sans;
}
.blog-content a {
  @apply text-cyber-accent hover:underline;
}
.blog-content code {
  @apply bg-cyber-surface px-1.5 py-0.5 rounded text-sm font-mono text-cyber-accent;
}
.blog-content pre {
  @apply bg-cyber-darker border border-cyber-accent/10 rounded-lg p-4 overflow-x-auto;
}
.blog-content pre code {
  @apply bg-transparent p-0;
}
.blog-content ul, .blog-content ol {
  @apply pl-6 mb-4 space-y-1;
}
.blog-content li {
  @apply text-cyber-text-dim;
}
.blog-content li::marker {
  @apply text-cyber-accent;
}
.blog-content blockquote {
  @apply border-l-2 border-cyber-accent/20 pl-4 italic text-cyber-muted;
}
.blog-content img {
  @apply rounded-lg border border-cyber-accent/10;
}
.blog-content hr {
  @apply border-cyber-subtle my-8;
}
</style>
