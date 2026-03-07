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
  <div class="pt-16 pb-16 px-6 min-h-screen">
    <article v-if="post" class="max-w-3xl mx-auto">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-1 text-sm font-mono text-cyber-subtle hover:text-cyber-accent transition-colors mb-8"
      >
        &larr; Back to blog
      </NuxtLink>

      <header class="mb-12">
        <h1 class="text-3xl md:text-5xl font-bold text-cyber-text mb-4" style="font-family: 'Inter', 'Space Grotesk', sans-serif;">
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
  font-family: 'Inter', 'Space Grotesk', sans-serif;
  color: #a9b1d6;
  line-height: 1.85;
  font-size: 1.05rem;
}

/* Headings */
.blog-content h1,
.blog-content h2,
.blog-content h3,
.blog-content h4 {
  font-family: 'Inter', 'Space Grotesk', sans-serif;
  color: #c0caf5;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.blog-content h2 {
  font-size: 1.65rem;
  margin-top: 3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(122, 162, 247, 0.1);
  color: #7aa2f7;
}

.blog-content h3 {
  font-size: 1.3rem;
  margin-top: 2.25rem;
  margin-bottom: 0.75rem;
  color: #c0caf5;
}

.blog-content h4 {
  font-size: 1.1rem;
  margin-top: 1.75rem;
  margin-bottom: 0.5rem;
  color: #9aa5ce;
}

/* Paragraphs */
.blog-content p {
  margin-bottom: 1.25rem;
  color: #a9b1d6;
  line-height: 1.85;
}

/* Links */
.blog-content a {
  color: #7aa2f7;
  text-decoration: underline;
  text-decoration-color: rgba(122, 162, 247, 0.3);
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition: text-decoration-color 0.2s ease, color 0.2s ease;
}

.blog-content a:hover {
  color: #89b4fa;
  text-decoration-color: rgba(122, 162, 247, 0.8);
}

/* Inline code */
.blog-content code {
  font-family: 'Space Mono', monospace;
  font-size: 0.85em;
  color: #7aa2f7;
  background: rgba(122, 162, 247, 0.08);
  border: 1px solid rgba(122, 162, 247, 0.1);
  padding: 0.15em 0.4em;
  border-radius: 4px;
}

/* Code blocks */
.blog-content pre {
  background: #0a0a0f !important;
  border: 1px solid rgba(122, 162, 247, 0.12);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin: 1.5rem 0;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.7;
}

.blog-content pre code {
  background: transparent !important;
  border: none;
  padding: 0;
  font-size: inherit;
  color: #a9b1d6;
}

/* Lists */
.blog-content ul,
.blog-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.blog-content ul {
  list-style-type: disc;
}

.blog-content ol {
  list-style-type: decimal;
}

.blog-content li {
  color: #a9b1d6;
  margin-bottom: 0.4rem;
  line-height: 1.75;
  padding-left: 0.25rem;
}

.blog-content li::marker {
  color: #7aa2f7;
}

/* Blockquotes */
.blog-content blockquote {
  border-left: 3px solid rgba(122, 162, 247, 0.3);
  padding: 0.75rem 1.25rem;
  margin: 1.5rem 0;
  background: rgba(122, 162, 247, 0.03);
  border-radius: 0 6px 6px 0;
}

.blog-content blockquote p {
  color: #9aa5ce;
  font-style: italic;
  margin-bottom: 0;
}

/* Images */
.blog-content img {
  border-radius: 8px;
  border: 1px solid rgba(122, 162, 247, 0.1);
  margin: 1.5rem 0;
  max-width: 100%;
}

/* Horizontal rule */
.blog-content hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, rgba(122, 162, 247, 0.2), rgba(122, 162, 247, 0.05), transparent);
  margin: 2.5rem 0;
}

/* Strong / Bold */
.blog-content strong {
  color: #c0caf5;
  font-weight: 600;
}

/* Emphasis */
.blog-content em {
  color: #9aa5ce;
}
</style>
