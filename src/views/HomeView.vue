<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import TheWelcome from '../components/TheWelcome.vue'

const backendStatus = ref('verificando...')

onMounted(async () => {
  try {
    const response = await api.get('/status')
    backendStatus.value = `conectado (banco: ${response.data.database ? 'ok' : 'falhou'})`
  } catch (error) {
    backendStatus.value = 'erro ao conectar com o backend'
  }
})
</script>

<template>
  <main>
    <p>Status do backend: {{ backendStatus }}</p>
    <TheWelcome />
  </main>
</template>
