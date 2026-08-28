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
  border-radius: var(--raio-pill);
  border: 2px solid var(--cor-borda);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}

.app-botao:active:not(:disabled) {
  transform: translate(3px, 3px);
  box-shadow: none !important;
}

.app-botao:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-botao--primaria {
  background: var(--cor-primaria);
  color: var(--cor-tinta);
  box-shadow: var(--sombra-deslocada-sm);
}

.app-botao--primaria:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--cor-tinta);
}

.app-botao--secundaria {
  background: var(--cor-superficie);
  color: var(--cor-tinta);
  box-shadow: var(--sombra-deslocada-sm);
}

.app-botao--secundaria:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--cor-tinta);
}

.app-botao--perigo {
  background: var(--cor-alerta-fundo);
  color: var(--cor-alerta);
  border-color: var(--cor-alerta);
  box-shadow: 3px 3px 0 var(--cor-alerta);
}

.app-botao--perigo:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--cor-alerta);
}

.app-botao--fantasma {
  background: transparent;
  color: var(--cor-tinta-suave);
  border-color: transparent;
  box-shadow: none;
  padding: var(--espaco-2) var(--espaco-3);
}

.app-botao--fantasma:hover:not(:disabled) {
  color: var(--cor-tinta);
  text-decoration: underline;
}
</style>
