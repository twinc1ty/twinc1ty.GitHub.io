<template>
  <NuxtLink to="/" class="brand-mark group">
    <svg viewBox="0 0 10 10" width="9" height="9" fill="none" class="opacity-80 group-hover:opacity-100 transition-opacity duration-200">
      <path d="M5 0 L10 5 L5 10 L0 5Z" fill="#5b21e0" />
    </svg>
    <span class="brand-mark__text">twinc1ty</span>
  </NuxtLink>
</template>

<style scoped>
.brand-mark {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.brand-mark__text {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  color: #0b0a0e;
  transition: color 0.2s ease;
}

.brand-mark:hover .brand-mark__text {
  color: #5b21e0;
}
</style>
