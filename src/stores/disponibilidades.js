import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useDisponibilidadesStore = defineStore('disponibilidades', () => {
  const lista = ref([])
  const carregando = ref(false)

  async function buscar() {
    carregando.value = true
    try {
      const resposta = await api.get('/disponibilidades')
      lista.value = resposta.data
    } finally {
      carregando.value = false
    }
  }

  async function criar(dados) {
    const resposta = await api.post('/disponibilidades', { disponibilidade: dados })
    lista.value.push(resposta.data)
  }

  async function remover(id) {
    await api.delete(`/disponibilidades/${id}`)
    lista.value = lista.value.filter((disponibilidade) => disponibilidade.id !== id)
  }

  return { lista, carregando, buscar, criar, remover }
})
