<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mensagensDeErro } from '@/utils/erros'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppAlerta from '@/components/ui/AppAlerta.vue'

const nome = ref('')
const email = ref('')
const senha = ref('')
const carregando = ref(false)
const erros = ref([])

const auth = useAuthStore()
const router = useRouter()

async function enviar() {
  erros.value = []
  carregando.value = true
  try {
    await auth.cadastrar(nome.value, email.value, senha.value)
    router.push('/painel/servicos')
  } catch (erro) {
    erros.value = mensagensDeErro(erro.response?.data?.errors)
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="pagina-auth">
    <div class="pagina-auth__marca">
      Agenda<span class="pagina-auth__marca-acento">Fácil</span>
    </div>

    <AppCard class="pagina-auth__card">
      <h1>Criar conta</h1>
      <p class="pagina-auth__subtitulo">Configure sua agenda em poucos minutos.</p>

      <form class="pagina-auth__form" @submit.prevent="enviar">
        <AppAlerta :mensagens="erros" />
        <AppInput v-model="nome" label="Nome" obrigatorio placeholder="Seu nome" />
        <AppInput v-model="email" label="Email" tipo="email" obrigatorio placeholder="voce@exemplo.com" />
        <AppInput v-model="senha" label="Senha" tipo="password" obrigatorio placeholder="mínimo 6 caracteres" />
        <AppButton tipo="submit" :desabilitado="carregando">
          {{ carregando ? 'Criando…' : 'Criar conta' }}
        </AppButton>
      </form>

      <p class="pagina-auth__rodape">
        Já tem conta? <RouterLink to="/login">Entrar</RouterLink>
      </p>
    </AppCard>
  </div>
</template>

<style scoped>
.pagina-auth {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--espaco-6);
  padding: var(--espaco-5);
}

.pagina-auth__marca {
  font-family: var(--fonte-display);
  font-size: 2rem;
  font-weight: 600;
}

.pagina-auth__marca-acento {
  color: var(--cor-primaria);
}

.pagina-auth__card {
  width: 100%;
  max-width: 380px;
}

.pagina-auth__subtitulo {
  color: var(--cor-tinta-suave);
  margin-top: var(--espaco-2);
  margin-bottom: var(--espaco-5);
}

.pagina-auth__form {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-4);
}

.pagina-auth__rodape {
  margin-top: var(--espaco-5);
  font-size: 0.9rem;
  color: var(--cor-tinta-suave);
  text-align: center;
}

.pagina-auth__rodape a {
  color: var(--cor-primaria-escura);
  font-weight: 600;
}
</style>
