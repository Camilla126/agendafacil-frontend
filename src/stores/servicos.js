import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useServicosStore = defineStore('servicos', () => {
  const lista = ref([])
  const carregando = ref(false)

  async function buscar() {
    carregando.value = true
    try {
      const resposta = await api.get('/servicos')
      lista.value = resposta.data
    } finally {
      carregando.value = false
    }
  }

  async function criar(dados) {
    const resposta = await api.post('/servicos', { servico: dados })
    lista.value.push(resposta.data)
  }

  async function remover(id) {
    await api.delete(`/servicos/${id}`)
    lista.value = lista.value.filter((servico) => servico.id !== id)
  }

  return { lista, carregando, buscar, criar, remover }
})
