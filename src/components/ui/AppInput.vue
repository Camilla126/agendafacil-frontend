<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: "" },
  tipo: { type: String, default: "text" },
  obrigatorio: { type: Boolean, default: false },
  erro: { type: String, default: "" },
  placeholder: { type: String, default: "" },
})
defineEmits(["update:modelValue"])
</script>

<template>
  <label class="app-campo">
    <span class="app-campo__rotulo">{{ label }}<span v-if="obrigatorio" class="app-campo__obrigatorio"> *</span></span>
    <input
      class="app-campo__input"
      :class="{ 'app-campo__input--erro': erro }"
      :type="tipo"
      :placeholder="placeholder"
      :value="modelValue"
      :required="obrigatorio"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="erro" class="app-campo__erro">{{ erro }}</span>
  </label>
</template>

<style scoped>
.app-campo {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-2);
}

.app-campo__rotulo {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--cor-tinta-suave);
}

.app-campo__obrigatorio {
  color: var(--cor-primaria-escura);
}

.app-campo__input {
  padding: var(--espaco-3) var(--espaco-4);
  border: 2px solid var(--cor-borda);
  border-radius: var(--raio-sm);
  background: var(--cor-superficie);
  font-size: 1rem;
  transition: box-shadow 0.15s ease;
}

.app-campo__input:focus {
  outline: none;
  box-shadow: var(--sombra-deslocada-sm);
}

.app-campo__input--erro {
  border-color: var(--cor-alerta);
}

.app-campo__erro {
  font-size: 0.85rem;
  color: var(--cor-alerta);
  font-weight: 500;
}
</style>
