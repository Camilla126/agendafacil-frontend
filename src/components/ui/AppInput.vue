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
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--tinta-suave);
}

.app-campo__obrigatorio {
  color: var(--led);
}

.app-campo__input {
  padding: var(--espaco-3) var(--espaco-3);
  border: none;
  border-bottom: 2px solid var(--contracapa-forte);
  border-radius: 0;
  background: transparent;
  font-size: 1rem;
  transition: border-color 0.1s ease;
}

.app-campo__input:focus {
  border-color: var(--azul-selo);
}

.app-campo__input--erro {
  border-color: var(--vermelho-carimbo);
}

.app-campo__erro {
  font-size: 0.8rem;
  color: var(--vermelho-carimbo);
  font-weight: 500;
}
</style>
