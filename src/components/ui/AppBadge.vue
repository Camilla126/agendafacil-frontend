<script setup>
const props = defineProps({
  status: { type: String, required: true }, // confirmado | pendente | cancelado
})

const rotulos = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
}
</script>

<template>
  <span class="app-badge" :class="`app-badge--${status}`">{{ rotulos[status] ?? status }}</span>
</template>

<style scoped>
.app-badge {
  display: inline-block;
  padding: var(--espaco-1) var(--espaco-3);
  border-radius: var(--raio-pill);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.app-badge--confirmado {
  background: var(--cor-sucesso-fundo);
  color: var(--cor-sucesso);
}

.app-badge--pendente {
  background: var(--cor-pendente-fundo);
  color: var(--cor-pendente);
}

.app-badge--cancelado {
  background: var(--cor-alerta-fundo);
  color: var(--cor-alerta);
  text-decoration: line-through;
}
</style>
