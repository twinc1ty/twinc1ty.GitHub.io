<template>
  <div class="min-h-screen relative">
    <BrandMark />
    <ClientOnly>
      <SiteKnobDock />
    </ClientOnly>
    <main class="relative z-10" style="padding-bottom: var(--footer-h)">
      <slot />
    </main>
    <Footer />
  </div>
</template>
