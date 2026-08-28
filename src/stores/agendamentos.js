import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAgendamentosStore = defineStore('agendamentos', () => {
  const lista = ref([])
  const carregando = ref(false)

  async function buscar() {
    carregando.value = true
    try {
      const resposta = await api.get('/agendamentos')
      lista.value = resposta.data
    } finally {
      carregando.value = false
    }
  }

  async function cancelar(id) {
    const resposta = await api.patch(`/agendamentos/${id}/cancelar`)
    const indice = lista.value.findIndex((agendamento) => agendamento.id === id)
    if (indice !== -1) lista.value[indice] = resposta.data
  }

  return { lista, carregando, buscar, cancelar }
})
