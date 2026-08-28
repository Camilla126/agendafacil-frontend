<template>
  <div class="app-card">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background: var(--cor-superficie);
  border: 2px solid var(--cor-borda);
  border-radius: var(--raio-md);
  box-shadow: var(--sombra-deslocada-sm);
  padding: var(--espaco-5);
}
</style>
