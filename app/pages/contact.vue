<script setup lang="ts">
import gsap from 'gsap'

useSeoMeta({
  title: 'Contact | twinc1ty',
  description: 'Get in touch',
})

const headingRef = ref<HTMLElement>()
const ruleRef = ref<HTMLElement>()
const descRef = ref<HTMLElement>()
const chipsRef = ref<HTMLElement>()

const links = [
  { label: 'GitHub', url: 'https://github.com/twinc1ty' },
  { label: 'Email', url: 'mailto:cyberhybird@hotmail.com' },
  { label: 'Discord', url: 'https://discord.com/users/278592690566725632' },
]

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(headingRef.value!, { opacity: 0, y: 30, duration: 0.7, clearProps: 'all' })
    .from(ruleRef.value!, { scaleX: 0, duration: 0.5, ease: 'power4.inOut' }, 0.25)
    .from(descRef.value!, { opacity: 0, y: 20, duration: 0.5, clearProps: 'all' }, 0.4)

  if (chipsRef.value) {
    // No opacity fade here — these links are critical content and must
    // never be left invisible if the animation fails to run/complete.
    tl.from(chipsRef.value.children, {
      y: 20, stagger: 0.08, duration: 0.5, ease: 'power3.out', clearProps: 'all',
    }, 0.55)
  }
})
</script>

<template>
  <div class="page-shell">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-10">
        <p class="page-kicker">Signal</p>
        <h1 ref="headingRef" class="page-title">Contact</h1>
        <div ref="ruleRef" class="page-rule mx-auto" />
      </div>

      <p ref="descRef" class="text-cyber-text-dim mb-12 max-w-sm mx-auto font-sans text-base leading-relaxed">
        Let's work on your next big project together.<br />Reach out via any platform below.
      </p>

      <div ref="chipsRef" class="flex flex-wrap items-center justify-center gap-4">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-chip"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </div>
</template>
