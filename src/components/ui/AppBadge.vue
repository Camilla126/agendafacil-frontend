<script setup>
defineProps({
  status: { type: String, required: true }, // confirmado | pendente | cancelado
})

const rotulos = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
}
</script>

<template>
  <span class="app-selo" :class="`app-selo--${status}`">
    <span class="app-selo__ponto" />
    {{ rotulos[status] ?? status }}
  </span>
</template>

<style scoped>
.app-selo {
  display: inline-flex;
  align-items: center;
  gap: var(--espaco-2);
  font-family: var(--fonte-numero);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.app-selo__ponto {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
}

.app-selo--confirmado {
  color: var(--verde-carimbo);
}
.app-selo--confirmado .app-selo__ponto {
  background: var(--verde-carimbo);
}

.app-selo--pendente {
  color: var(--ambar-carimbo);
}
.app-selo--pendente .app-selo__ponto {
  background: var(--ambar-carimbo);
}

.app-selo--cancelado {
  color: var(--tinta-fraca);
  text-decoration: line-through;
}
.app-selo--cancelado .app-selo__ponto {
  background: var(--tinta-fraca);
}
</style>
