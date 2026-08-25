<template>
  <div class="min-h-screen relative">
    <BrandMark />
    <ClientOnly>
      <SiteKnobDock />
    </ClientOnly>
    <main class="relative z-10 page-main">
      <slot />
    </main>
    <Footer />
  </div>
</template>
