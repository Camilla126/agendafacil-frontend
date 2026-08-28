import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

const CHAVE_TOKEN = 'agendafacil_token'
const CHAVE_PROFISSIONAL = 'agendafacil_profissional'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(CHAVE_TOKEN))
  const profissional = ref(JSON.parse(localStorage.getItem(CHAVE_PROFISSIONAL) ?? 'null'))

  const autenticado = computed(() => Boolean(token.value))

  function persistir(novoToken, novoProfissional) {
    token.value = novoToken
    profissional.value = novoProfissional
    localStorage.setItem(CHAVE_TOKEN, novoToken)
    localStorage.setItem(CHAVE_PROFISSIONAL, JSON.stringify(novoProfissional))
  }

  async function login(email, senha) {
    const resposta = await api.post('/login', { email, senha })
    persistir(resposta.data.token, resposta.data.profissional)
  }

  async function cadastrar(nome, email, senha) {
    await api.post('/profissionais', { profissional: { nome, email, senha } })
    await login(email, senha)
  }

  function logout() {
    token.value = null
    profissional.value = null
    localStorage.removeItem(CHAVE_TOKEN)
    localStorage.removeItem(CHAVE_PROFISSIONAL)
  }

  return { token, profissional, autenticado, login, cadastrar, logout }
})
