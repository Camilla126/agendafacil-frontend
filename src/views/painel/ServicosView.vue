<script setup>
import { onMounted, ref } from 'vue'
import { useServicosStore } from '@/stores/servicos'
import { mensagensDeErro } from '@/utils/erros'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppAlerta from '@/components/ui/AppAlerta.vue'

const store = useServicosStore()

const nome = ref('')
const duracaoMinutos = ref(30)
const valor = ref('')
const enviando = ref(false)
const erros = ref([])

onMounted(() => store.buscar())

async function criar() {
  erros.value = []
  enviando.value = true
  try {
    await store.criar({
      nome: nome.value,
      duracao_minutos: duracaoMinutos.value,
      valor: valor.value || null,
    })
    nome.value = ''
    duracaoMinutos.value = 30
    valor.value = ''
  } catch (erro) {
    erros.value = mensagensDeErro(erro.response?.data?.errors)
  } finally {
    enviando.value = false
  }
}

async function remover(id) {
  await store.remover(id)
}

function formatarValor(valor) {
  if (valor === null || valor === undefined) return null
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <section>
    <header class="cabecalho">
      <h1>Serviços</h1>
      <p>O que você oferece, e quanto tempo cada atendimento leva.</p>
    </header>

    <AppCard class="formulario-card">
      <form class="formulario" @submit.prevent="criar">
        <AppAlerta :mensagens="erros" />
        <div class="formulario__linha">
          <AppInput v-model="nome" label="Nome do serviço" obrigatorio placeholder="Corte de cabelo" />
          <AppInput v-model.number="duracaoMinutos" label="Duração (minutos)" tipo="number" obrigatorio />
          <AppInput v-model="valor" label="Valor (opcional)" tipo="number" placeholder="50.00" />
        </div>
        <AppButton tipo="submit" :desabilitado="enviando">
          {{ enviando ? 'Adicionando…' : '+ Adicionar serviço' }}
        </AppButton>
      </form>
    </AppCard>

    <ul v-if="store.lista.length" class="lista">
      <li v-for="servico in store.lista" :key="servico.id" class="lista__item">
        <div>
          <p class="lista__nome">{{ servico.nome }}</p>
          <p class="lista__detalhe">
            {{ servico.duracao_minutos }} min
            <span v-if="formatarValor(servico.valor)"> · {{ formatarValor(servico.valor) }}</span>
          </p>
        </div>
        <AppButton variante="fantasma" @click="remover(servico.id)">Remover</AppButton>
      </li>
    </ul>
    <p v-else-if="!store.carregando" class="vazio">Você ainda não cadastrou nenhum serviço.</p>
  </section>
</template>

<style scoped>
.cabecalho {
  margin-bottom: var(--espaco-6);
}

.cabecalho p {
  color: var(--cor-tinta-suave);
  margin-top: var(--espaco-1);
}

.formulario-card {
  margin-bottom: var(--espaco-6);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-4);
}

.formulario__linha {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--espaco-4);
}

.lista {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-3);
}

.lista__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--cor-superficie);
  border: 2px solid var(--cor-borda);
  border-radius: var(--raio-sm);
  padding: var(--espaco-4);
}

.lista__nome {
  font-weight: 700;
}

.lista__detalhe {
  color: var(--cor-tinta-suave);
  font-size: 0.9rem;
  margin-top: var(--espaco-1);
}

.vazio {
  color: var(--cor-tinta-fraca);
}

@media (max-width: 640px) {
  .formulario__linha {
    grid-template-columns: 1fr;
  }
}
</style>
