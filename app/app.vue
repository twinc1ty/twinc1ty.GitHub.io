<script setup lang="ts">
import gsap from 'gsap'

const { initRandomTheme } = useTheme()

onMounted(() => {
  initRandomTheme()
})

function onBeforeEnter(el: Element) {
  gsap.set(el, { opacity: 0, scale: 0.97, filter: 'blur(8px)' })
}

function onEnter(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.6,
    ease: 'power4.out',
    onComplete: done,
  })
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    scale: 1.03,
    filter: 'blur(6px)',
    y: -30,
    duration: 0.4,
    ease: 'power3.in',
    onComplete: done,
  })
}
</script>

<template>
  <Preloader />
  <ClientOnly>
    <CustomCursor />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage
      :transition="{
        css: false,
        onBeforeEnter,
        onEnter,
        onLeave,
        mode: 'out-in',
      }"
    />
  </NuxtLayout>
</template>

<style>
@import '~/assets/css/main.css';
</style>
