<script setup>
defineProps({
  variante: { type: String, default: "primaria" }, // primaria | secundaria | perigo | fantasma
  tipo: { type: String, default: "button" },
  desabilitado: { type: Boolean, default: false },
})
</script>

<template>
  <button :type="tipo" class="app-botao" :class="`app-botao--${variante}`" :disabled="desabilitado">
    <slot />
  </button>
</template>

<style scoped>
.app-botao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--espaco-2);
  padding: var(--espaco-3) var(--espaco-5);
  border-radius: 0;
  border: 2px solid var(--tinta);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background-color 0.1s ease, color 0.1s ease, transform 0.05s ease;
}

.app-botao:active:not(:disabled) {
  transform: translateY(1px);
}

.app-botao:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.app-botao--primaria {
  background: var(--azul-selo);
  border-color: var(--azul-selo);
  color: var(--papel);
}

.app-botao--primaria:hover:not(:disabled) {
  background: var(--azul-selo-escuro);
  border-color: var(--azul-selo-escuro);
}

.app-botao--secundaria {
  background: var(--papel);
  color: var(--tinta);
}

.app-botao--secundaria:hover:not(:disabled) {
  background: var(--contracapa);
}

.app-botao--perigo {
  background: var(--papel);
  color: var(--vermelho-carimbo);
  border-color: var(--vermelho-carimbo);
}

.app-botao--perigo:hover:not(:disabled) {
  background: var(--vermelho-carimbo-fundo);
}

.app-botao--fantasma {
  background: transparent;
  color: var(--tinta-suave);
  border-color: transparent;
  padding: var(--espaco-2) var(--espaco-3);
}

.app-botao--fantasma:hover:not(:disabled) {
  color: var(--tinta);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
