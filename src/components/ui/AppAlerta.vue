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
  background: var(--vermelho-carimbo-fundo);
  border-left: 4px solid var(--vermelho-carimbo);
  padding: var(--espaco-3) var(--espaco-4);
  color: var(--vermelho-carimbo);
  font-weight: 500;
  font-size: 0.9rem;
}

.app-alerta p + p {
  margin-top: var(--espaco-1);
}
</style>
