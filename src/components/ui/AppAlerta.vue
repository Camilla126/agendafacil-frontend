<script setup>
defineProps({
  mensagens: { type: Array, default: () => [] },
})
</script>

<template>
  <div v-if="mensagens.length" class="app-alerta" role="alert">
    <p v-for="(mensagem, indice) in mensagens" :key="indice">{{ mensagem }}</p>
  </div>
</template>

<style scoped>
.app-alerta {
  background: var(--cor-alerta-fundo);
  border: 2px solid var(--cor-alerta);
  border-radius: var(--raio-sm);
  padding: var(--espaco-3) var(--espaco-4);
  color: var(--cor-alerta);
  font-weight: 500;
  font-size: 0.9rem;
}

.app-alerta p + p {
  margin-top: var(--espaco-1);
}
</style>
