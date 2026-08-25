<template>
  <NuxtLink to="/" class="brand-mark group">
    <span class="brand-mark__box">twin</span><span class="brand-mark__rest">c1ty</span>
  </NuxtLink>
</template>

<style scoped>
.brand-mark {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 60;
  display: inline-flex;
  align-items: stretch;
  text-decoration: none;
}

.brand-mark__box {
  width: 2.7rem;
  height: 2.7rem;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-right: 0.2rem;
  background: #5b21e0;
  color: #fafaf7;
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  transition: background-color 0.2s ease;
}

.brand-mark__rest {
  display: inline-flex;
  align-items: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  color: #5b21e0;
  transition: color 0.2s ease;
}

.brand-mark:hover .brand-mark__box {
  background: #0b0a0e;
}

.brand-mark:hover .brand-mark__rest {
  color: #0b0a0e;
}
</style>
