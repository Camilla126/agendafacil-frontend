<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppAlerta from '@/components/ui/AppAlerta.vue'

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
    await auth.login(email.value, senha.value)
    router.push('/painel/servicos')
  } catch {
    erros.value = ['Email ou senha inválidos.']
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="pagina-auth">
    <div class="pagina-auth__marca">
      Agenda<em>Fácil</em>
    </div>

    <AppCard class="pagina-auth__card">
      <p class="pagina-auth__eyebrow">Guichê 00 · Identificação</p>
      <h1>Entrar</h1>

      <form class="pagina-auth__form" @submit.prevent="enviar">
        <AppAlerta :mensagens="erros" />
        <AppInput v-model="email" label="Email" tipo="email" obrigatorio placeholder="voce@exemplo.com" />
        <AppInput v-model="senha" label="Senha" tipo="password" obrigatorio placeholder="••••••••" />
        <AppButton tipo="submit" :desabilitado="carregando">
          {{ carregando ? 'Entrando…' : 'Entrar' }}
        </AppButton>
      </form>

      <p class="pagina-auth__rodape">
        Ainda não tem conta? <RouterLink to="/cadastro">Cadastre-se</RouterLink>
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
  font-family: var(--fonte-titulo);
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
}

.pagina-auth__marca em {
  font-style: normal;
  color: var(--azul-selo);
}

.pagina-auth__card {
  width: 100%;
  max-width: 380px;
}

.pagina-auth__eyebrow {
  font-family: var(--fonte-numero);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tinta-fraca);
  margin-bottom: var(--espaco-2);
}

.pagina-auth__card h1 {
  font-size: 1.8rem;
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
  color: var(--tinta-suave);
  text-align: center;
}

.pagina-auth__rodape a {
  color: var(--azul-selo);
  font-weight: 600;
}
</style>
